#!/usr/bin/env node
// deepen.mjs — give the build the git history the sitemap dates pages by.
//
// Runs first in `npm run build`. tools/lastmod.mjs reads `git log` to work out
// when each page last changed; a shallow checkout has no history to read and
// lies about it (its boundary commit is grafted as a root, so every file
// reports as added by that one commit), so lastmod stands down there and the
// sitemap ships without it.
//
// Shallow is the normal case for a build: `actions/checkout` defaults to
// `fetch-depth: 1`, hosted builders clone shallow to start faster, and
// Cloudflare Workers Builds does not document what it does either way. Rather
// than requiring a build command to be edited somewhere outside this repo —
// where nobody would find it, and where it could not be verified from here —
// the build asks for the history itself.
//
// Three things it will not do:
//
//   - Touch the network on a complete checkout. The shallow test is local, and
//     a developer's ordinary `npm run build` does nothing at all here.
//   - Fail the build. No git, no network, no permission: warn and carry on.
//     A sitemap without lastmod is valid; a build that cannot run is not.
//   - Hang. The fetch is bounded, because a build that stalls on a network
//     call is worse than one that skips a recrawl hint.

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TIMEOUT_MS = 60_000

const git = (args) =>
  execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()

let shallow
try {
  shallow = git(['rev-parse', '--is-shallow-repository'])
} catch {
  // Not a git checkout at all — a tarball, or a vendored copy. Nothing to
  // deepen, and lastmod will stand down on its own.
  process.exit(0)
}

// The overwhelmingly common local case: say nothing, do nothing.
if (shallow === 'false') process.exit(0)

try {
  git(['fetch', '--unshallow', '--quiet'])
  console.log('  history: deepened a shallow checkout, so pages can be dated')
} catch (error) {
  const detail = String(error?.stderr || error?.message || error)
    .split('\n')
    .find((line) => line.trim())
  console.warn(`  history: could not deepen this shallow checkout — ${detail}`)
  console.warn('  history: the sitemap will ship without lastmod, which is valid')
}
