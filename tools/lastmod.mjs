// When each page last actually changed, for the sitemap's <lastmod>.
//
// Google treats lastmod as a recrawl hint and ignores it wholesale on sites
// where it looks invented — a build timestamp stamped on all 97 pages says
// only "the site was rebuilt", which is exactly the claim that earns the
// whole signal being dropped. So the date comes from git: the last commit
// that touched the file the page is rendered from.
//
// A page whose source cannot be identified gets no lastmod rather than a
// guess, and where the history itself cannot be trusted — no git at all, or
// a shallow clone, which is what most CI checkouts are — every page goes
// without. An absent lastmod is allowed by the sitemap schema and costs
// nothing; a wrong one costs the signal for the whole site.

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Repo-relative path -> ISO date of the most recent commit touching it.
 *
 * One `git log` for the whole repo rather than one per file: 97 pages would
 * otherwise be 97 subprocesses. The log is reverse-chronological, so the
 * first date a path appears under is its latest.
 */
function commitDates() {
  const dates = new Map()
  let log
  try {
    // A shallow clone has no history to read, and does not say so: its
    // boundary commit is grafted as a root, so `git log --name-only` reports
    // every tracked file as added by that one commit, under one timestamp.
    // That is worse than no history — it looks complete, and it would stamp
    // every page with the moment the repo was cloned. A partial clone is the
    // same trap in miniature: files untouched within the fetched depth all
    // fall on the boundary date.
    //
    // Shallow is the common case for a build, not the exception, which is
    // why tools/deepen.mjs runs first in `npm run build` and fetches the
    // history this needs. This stays as the backstop for when that could
    // not: no network, no permission, or a build invoked some other way.
    // Absent lastmod is allowed by the schema, and it is why the tests
    // accept a sitemap without it.
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim()
    if (shallow !== 'false') return dates

    log = execFileSync('git', ['log', '--no-merges', '--name-only', '--format=%cI'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    })
  } catch {
    return dates // no git, no history: every page goes without.
  }

  let current = null
  for (const line of log.split('\n')) {
    if (!line) continue
    if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
      current = line
    } else if (current && !dates.has(line)) {
      dates.set(line, current)
    }
  }
  return dates
}

/**
 * Data a route renders content from, beyond its own file.
 *
 * A page can change without its own source changing: /releases builds its
 * table from PACKAGES in consts.ts, so a routine package bump edits neither
 * releases.astro nor anything else this map would otherwise reach, and the
 * page's lastmod would sit still while the page changed.
 *
 * Chrome does not count — nearly every page imports SITE_TITLE from consts,
 * and dating them all by it would report a change on 97 pages every time the
 * nav is touched. Only what the page renders as content belongs here.
 * test/artifacts.test.mjs checks this map against what the pages import.
 */
const RENDERS_FROM = {
  '/releases': ['src/consts.ts'],
  '/skills': ['src/data/skills.json'],
  '/agents': ['src/data/skills.json', 'src/data/mcp-tools.json'],
  '/mcp': ['src/data/skills.json', 'src/data/mcp-tools.json'],
  '/api': ['src/openapi.ts', 'src/errors.ts', 'src/data/mcp-tools.json'],
  '/errors': ['src/data/error-codes.json', 'src/data/plugins.json'],
}

/**
 * The source file(s) a route is rendered from.
 *
 * Most routes are one file under src/pages. The two content collections are
 * one file per entry. The generated catalogues are different: an error page
 * and a skill page have no source of their own, they are rendered from data
 * that tools/gen-ax-data.mjs writes, so the data file is what dates them.
 */
export function sourcesFor(pathname) {
  const path = pathname.replace(/\/$/, '')
  if (path === '') return ['src/pages/index.astro']

  const [, section, rest] = path.match(/^\/([^/]+)(?:\/(.+))?$/) ?? []
  if (!section) return []

  if (section === 'docs') {
    const id = rest ?? 'introduction' // /docs renders the introduction
    return [`src/content/docs/${id}.mdx`, `src/content/docs/${id}.md`]
  }
  if (section === 'how-to' && rest) {
    return [`src/content/howto/${rest}.md`, `src/content/howto/${rest}.mdx`]
  }
  if (section === 'how-to') return ['src/pages/how-to/index.astro']
  if (section === 'errors' && rest) {
    // Generated from both catalogues; the newer of the two dates the page.
    return ['src/data/error-codes.json', 'src/data/plugins.json']
  }
  if (section === 'errors') return ['src/pages/errors/index.astro', ...RENDERS_FROM['/errors']]
  if (section === 'skills' && rest) return ['src/data/skills.json']

  return [
    `src/pages/${path.slice(1)}.astro`,
    `src/pages/${path.slice(1)}.mdx`,
    `src/pages/${path.slice(1)}/index.astro`,
    ...(RENDERS_FROM[path] ?? []),
  ]
}

const dates = commitDates()

/**
 * One line for the build log saying whether lastmod is being emitted.
 *
 * Standing down on a shallow clone is correct but invisible, and "the
 * sitemap quietly has no lastmod" is exactly the kind of thing nobody
 * notices for a year. astro.config.mjs prints this, so any build log —
 * the hosted one included — says whether tools/deepen.mjs got the history
 * it went looking for.
 */
export function historyReport() {
  return dates.size
    ? `from git history (${dates.size} files)`
    : "omitted \u2014 no usable git history (a shallow clone has none to read)";
}

/**
 * The <lastmod> for a route, or undefined when it cannot be established.
 * Where a page is rendered from several files, the most recent one wins.
 */
export function lastmodFor(pathname) {
  const known = sourcesFor(pathname)
    .map((rel) => dates.get(rel))
    .filter(Boolean)
  if (!known.length) return undefined
  return known.sort().at(-1)
}
