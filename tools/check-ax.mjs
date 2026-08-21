#!/usr/bin/env node
// check-ax.mjs — guard the generated agent-facing surfaces.
//
// Two failure modes this catches, both of which used to be silent:
//
//   1. src/data/*.json drifting from the sibling repos it is generated from.
//      Delegated to gen-ax-data.mjs --check, which is a no-op when the
//      siblings are not checked out (CI clones only what it builds).
//
//   2. A page added to the site's navigation but missing from llms.txt.
//      llms.txt builds its link list from NAV/PROJECT_NAV/AGENT_NAV, but the
//      one-line blurb per page is authored — a page with no blurb would ship
//      as a bare link, which is exactly the drift making llms.txt generated
//      was meant to end.
//
// Usage: node tools/check-ax.mjs

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const problems = []

// --- 1. generated data is current -------------------------------------------

try {
  execFileSync('node', [join(ROOT, 'tools', 'gen-ax-data.mjs'), '--check'], {
    stdio: 'inherit',
  })
} catch {
  problems.push('src/data is stale — run `node tools/gen-ax-data.mjs`')
}

// --- 2. every navigable page has an llms.txt line ----------------------------

// Read the source rather than importing it: consts.ts is TypeScript, and this
// tool is plain Node with no build step. The lists are plain object literals,
// so the hrefs can be read off directly — and a shape this simple failing to
// match is itself worth reporting rather than passing silently.
function hrefs(source, listName) {
  const m = source.match(new RegExp(`export const ${listName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`))
  if (!m) {
    problems.push(`consts.ts: could not read ${listName}`)
    return []
  }
  return [...m[1].matchAll(/href:\s*"([^"]+)"/g)].map((x) => x[1])
}

const consts = readFileSync(join(ROOT, 'src', 'consts.ts'), 'utf8')
const llms = readFileSync(join(ROOT, 'src', 'pages', 'llms.txt.ts'), 'utf8')

const navigable = [
  ...hrefs(consts, 'NAV'),
  ...hrefs(consts, 'PROJECT_NAV'),
]
const agentPages = hrefs(consts, 'AGENT_NAV')

// AGENT_NAV carries its own blurb, so those are covered by construction. The
// rest need an entry in llms.txt's BLURBS map.
for (const href of navigable) {
  if (agentPages.includes(href)) continue
  if (!llms.includes(`"${href}":`)) {
    problems.push(`llms.txt: no blurb for ${href} — add it to BLURBS in src/pages/llms.txt.ts`)
  }
}

// --- 3. the pages the agent surfaces promise actually exist ------------------

const PAGES = [
  ['src/pages/skills.astro', '/skills'],
  ['src/pages/skills/[name].astro', '/skills/<name>'],
  ['src/pages/mcp.astro', '/mcp'],
  ['src/pages/errors/index.astro', '/errors'],
  ['src/pages/errors/[code].astro', '/errors/<code>'],
  ['src/pages/versions.json.ts', '/versions.json'],
  ['src/pages/llms.txt.ts', '/llms.txt'],
  ['src/pages/llms-full.txt.ts', '/llms-full.txt'],
]
for (const [file, route] of PAGES) {
  if (!existsSync(join(ROOT, file))) {
    problems.push(`${route} is linked but ${file} is missing`)
  }
}

// llms.txt is generated now; a leftover static copy in public/ would shadow
// the route and silently serve the stale one.
for (const stale of ['public/llms.txt', 'public/llms-full.txt']) {
  if (existsSync(join(ROOT, stale))) {
    problems.push(`${stale} shadows the generated route — delete it`)
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log('  agent surfaces: ok')
