// When each page last actually changed, for the sitemap's <lastmod>.
//
// Google treats lastmod as a recrawl hint and ignores it wholesale on sites
// where it looks invented — a build timestamp stamped on all 97 pages says
// only "the site was rebuilt", which is exactly the claim that earns the
// whole signal being dropped. So the date comes from git: the last commit
// that touched the file the page is rendered from.
//
// A page whose source cannot be identified gets no lastmod rather than a
// guess, and if git is unavailable (a tarball, a shallow clone with no
// history for a path) every page gets none. An absent lastmod is allowed by
// the sitemap schema and costs nothing; a wrong one costs the signal.

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
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

/** The first of `candidates` that exists in the repo, or null. */
function firstPresent(candidates) {
  for (const rel of candidates) {
    if (existsSync(join(ROOT, rel))) return rel
  }
  return null
}

/**
 * The source file(s) a route is rendered from.
 *
 * Most routes are one file under src/pages. The two content collections are
 * one file per entry. The generated catalogues are different: an error page
 * and a skill page have no source of their own, they are rendered from data
 * that tools/gen-ax-data.mjs writes, so the data file is what dates them.
 */
function sourcesFor(pathname) {
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
  if (section === 'errors') return ['src/pages/errors/index.astro']
  if (section === 'skills' && rest) return ['src/data/skills.json']

  return [
    `src/pages/${path.slice(1)}.astro`,
    `src/pages/${path.slice(1)}.mdx`,
    `src/pages/${path.slice(1)}/index.astro`,
  ]
}

const dates = commitDates()

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

/** Whether any history was found at all — used by the build-time check. */
export const hasHistory = () => dates.size > 0

/** The source file a route resolves to, or null. Exported for the check. */
export const sourceFor = (pathname) => firstPresent(sourcesFor(pathname))
