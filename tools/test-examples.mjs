#!/usr/bin/env node
// Run every site code example and check it produces what the site says it does.
//
// The site shows two versions of each example — TypeScript and Go — and claims
// they are equivalent. That claim is only worth making if it is checked: an
// untested Go translation is an invented one. So each example directory holds
//
//   examples/<id>/ts.ts        the TypeScript version
//   examples/<id>/go/main.go   the Go version
//   examples/<id>/expect.txt   the output BOTH must produce
//   examples/<id>/explain.md   the prose shown on the Explain tab
//
// and this runs both and compares. The site renders these files directly, so
// what a reader sees is exactly what was executed.
//
//   node tools/test-examples.mjs           run all
//   node tools/test-examples.mjs abnf-actions   run one

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXAMPLES = join(ROOT, 'examples')

const only = process.argv[2]
const ids = readdirSync(EXAMPLES, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((id) => !only || id === only)
  .sort()

if (0 === ids.length) {
  console.error(only ? `no such example: ${only}` : 'no examples found')
  process.exit(1)
}

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GOWORK: 'off', NO_COLOR: '1' },
  })
}

// Trailing whitespace differences are not what these tests are about.
const norm = (s) => s.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim()

let pass = 0
const failures = []

for (const id of ids) {
  const dir = join(EXAMPLES, id)
  const expectFile = join(dir, 'expect.txt')

  if (!existsSync(expectFile)) {
    failures.push([id, 'missing expect.txt — an example with no expected output is not tested'])
    continue
  }
  const want = norm(readFileSync(expectFile, 'utf8'))

  for (const [lang, exec] of [
    ['ts', () => run('node', [join(dir, 'ts.ts')], ROOT)],
    ['go', () => run('go', ['run', `./${id}/go`], EXAMPLES)],
  ]) {
    const src = 'ts' === lang ? join(dir, 'ts.ts') : join(dir, 'go', 'main.go')
    if (!existsSync(src)) {
      failures.push([`${id}:${lang}`, `missing ${lang} version`])
      continue
    }
    let got
    try {
      got = norm(exec())
    } catch (e) {
      const detail = norm(String(e.stderr || e.stdout || e.message)).split('\n').slice(0, 6).join('\n')
      failures.push([`${id}:${lang}`, `did not run:\n${detail}`])
      continue
    }
    if (got === want) {
      pass++
    } else {
      failures.push([`${id}:${lang}`, `output differs\n  want: ${JSON.stringify(want)}\n  got:  ${JSON.stringify(got)}`])
    }
  }

  if (!existsSync(join(dir, 'explain.md'))) {
    failures.push([id, 'missing explain.md — the Explain tab would be empty'])
  }
}

console.log(`examples: ${pass} run(s) matched, ${failures.length} problem(s), ${ids.length} example(s)`)
for (const [where, why] of failures) {
  console.log(`\n  FAIL ${where}\n    ${why.replace(/\n/g, '\n    ')}`)
}
process.exit(failures.length ? 1 : 0)
