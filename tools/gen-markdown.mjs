#!/usr/bin/env node
// gen-markdown.mjs — a markdown twin for every built page.
//
// The site answers `Accept: text/markdown` from the same URL that serves the
// HTML (acceptmarkdown.com); src/worker.ts does the negotiation and this is
// what it serves. `/why` gets `dist/why.md`, `/docs/quickstart` gets
// `dist/docs/quickstart.md`, `/` gets `dist/index.md`. The twins are also
// reachable directly by appending `.md`.
//
// It converts the BUILT HTML rather than the markdown sources, for the same
// reason llms-full.txt is generated: a hand-written second copy drifts, and
// half these pages (index, agents, mcp, faq, errors, skills) have no markdown
// source at all — they are .astro. Converting what shipped means the twin
// says what the page says, by construction.
//
// Only the content region is converted: `[data-pagefind-body]` where a page
// declares one — that is already the site's own answer to "which part of this
// page is the content" — and `<main>` otherwise. Navigation, the header and
// footer, scripts, styles and decorative markup never reach the output.
//
// Usage: node tools/gen-markdown.mjs [--check]
//   --check  report what would be written, write nothing, and fail if a page
//            produces no content (a layout change that silently empties the
//            twins would otherwise ship unnoticed).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const CHECK = process.argv.includes('--check')

// Build output that is not a page.
const SKIP_DIRS = new Set(['_astro', '_worker.js', 'pagefind', 'fonts', 'brand', 'diagrams'])

// Markup that carries no content: chrome, decoration, and the machinery that
// makes the tabbed code examples work in a browser.
const DROP = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'nav',
  'form',
  'input',
  '.heading-anchor',
  '[data-pagefind-ignore]',
  '[aria-hidden="true"]',
]

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full, out)
    } else if (entry.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

/** dist/why/index.html -> why.md, dist/index.html -> index.md, dist/404.html -> 404.md */
function twinPath(file) {
  const rel = relative(DIST, file).split(sep).join('/')
  if (rel === 'index.html') return 'index.md'
  if (rel.endsWith('/index.html')) return rel.replace(/\/index\.html$/, '.md')
  return rel.replace(/\.html$/, '.md')
}

/**
 * The text of a code block. Shiki emits one <span class="line"> per line with
 * no newline between them — the site's CSS breaks lines with display:block —
 * so textContent alone would return the whole block as a single line.
 */
function codeText(el) {
  const lines = el.querySelectorAll('span.line')
  if (lines.length) return [...lines].map((l) => l.textContent).join('\n')
  return el.textContent ?? ''
}

function fence(code, lang = '') {
  const body = code.replace(/\s+$/, '')
  // A fence must be longer than any backtick run inside it.
  const longest = Math.max(0, ...[...body.matchAll(/`+/g)].map((m) => m[0].length))
  const ticks = '`'.repeat(Math.max(3, longest + 1))
  return `${ticks}${lang}\n${body}\n${ticks}`
}

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
    strongDelimiter: '**',
    hr: '---',
    linkStyle: 'inlined',
  })
  td.use(gfm)

  // Code blocks, with the language Astro's Shiki recorded on the <pre>.
  td.addRule('shiki', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_content, node) =>
      '\n\n' + fence(codeText(node), node.getAttribute('data-language') ?? '') + '\n\n',
  })

  // The tabbed TypeScript / Go / Explain examples. Every version is in the
  // HTML (the tabs are CSS-only radio inputs), but in source order the three
  // tab labels come before all three panes, so a straight conversion
  // interleaves them wrongly. Emit one labelled block per pane instead.
  td.addRule('codetabs', {
    filter: (node) =>
      node.nodeName === 'DIV' && (node.getAttribute('class') ?? '').split(/\s+/).includes('codetabs'),
    replacement: (_content, node) => {
      const parts = []
      const label = node.querySelector('.code-label')
      if (label) parts.push(`**${label.textContent.trim()}**`)
      for (const [selector, lang, title] of [
        ['.pane-ts', 'ts', 'TypeScript'],
        ['.pane-go', 'go', 'Go'],
      ]) {
        const pane = node.querySelector(selector)
        if (pane) parts.push(`${title}:\n\n${fence(codeText(pane), lang)}`)
      }
      const explain = node.querySelector('.pane-ex')
      if (explain) parts.push(`Explain: ${td.turndown(explain.innerHTML).replace(/\n+/g, ' ').trim()}`)
      const out = node.querySelector('.code-out code')
      if (out) parts.push(`Output: \`${out.textContent.trim()}\``)
      return '\n\n' + parts.join('\n\n') + '\n\n'
    },
  })

  return td
}

function frontmatter(fields) {
  const escape = (v) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  const lines = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${escape(v)}`)
  return `---\n${lines.join('\n')}\n---\n\n`
}

const td = makeTurndown()
const files = walk(DIST).sort()
const problems = []
let written = 0

for (const file of files) {
  const { document } = parseHTML(readFileSync(file, 'utf8'))

  for (const selector of DROP) {
    for (const el of document.querySelectorAll(selector)) el.remove()
  }

  const region =
    document.querySelector('[data-pagefind-body]') ??
    document.querySelector('main') ??
    document.querySelector('body')

  const rel = twinPath(file)
  if (!region) {
    problems.push(`${rel}: no [data-pagefind-body], <main> or <body> to convert`)
    continue
  }

  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
  const title = document.querySelector('title')?.textContent?.trim()
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')

  // Site-relative links are useless to something reading the markdown out of
  // band, so resolve them against the page's own canonical URL.
  const origin = canonical ? new URL(canonical).origin : 'https://tabnas.dev'
  for (const [selector, attribute] of [
    ['a[href]', 'href'],
    ['img[src]', 'src'],
  ]) {
    for (const el of region.querySelectorAll(selector)) {
      const value = el.getAttribute(attribute)
      if (value && value.startsWith('/') && !value.startsWith('//')) {
        el.setAttribute(attribute, origin + value)
      }
    }
  }

  let body = td
    .turndown(region.innerHTML)
    // Layout markup leaves whitespace-only lines behind.
    .replace(/^[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (!body) {
    problems.push(`${rel}: converted to nothing`)
    continue
  }

  // Every twin carries a top-level heading. Not every page does: /why leads
  // with an eyebrow paragraph and its only <h1> is inside a pull quote, which
  // converts to a quoted heading rather than a document title. The <title> is
  // the page's own name for itself, minus the site suffix the layout adds.
  if (title) {
    const name = title.replace(/\s+[·—]\s+tabnas$/, '').trim()
    const firstHeading = body.split('\n').findIndex((l) => l.startsWith('# '))
    if (body.startsWith(`${name}\n`)) {
      body = `# ${body}` // the page opens with its own name, unmarked
    } else if (firstHeading === -1 || firstHeading > 4) {
      body = `# ${name}\n\n${body}`
    }
  }

  const out = frontmatter({ title, description, source: canonical }) + body + '\n'

  if (!CHECK) writeFileSync(join(DIST, rel), out)
  written++
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(`  markdown twins: ${written} page(s)${CHECK ? ' (check only)' : ''}`)
