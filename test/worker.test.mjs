// The Worker's behaviour, exercised against the real built site.
//
// Everything the site added for machine callers lives in src/worker.ts —
// markdown negotiation, the JSON error contract, the recoverable 404 — and
// none of it is visible in the static output, so nothing else here can test
// it. The ASSETS binding is stood in for by test/assets.mjs, which serves
// ./dist the way Cloudflare's asset worker does.
//
// Requires a build: `npm run build` before `npm test`.

import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import worker, {
  parseAccept,
  quality,
  explicitQuality,
  wantsMarkdown,
  markdownTwin,
  pageForTwin,
  isMachinePath,
  errorFormat,
  ENTRY_POINTS,
} from '../src/worker.ts'
import { makeAssets } from './assets.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const ORIGIN = 'https://tabnas.dev'

before(() => {
  assert.ok(
    existsSync(join(DIST, 'index.html')),
    'dist/ is missing — run `npm run build` before `npm test`',
  )
})

const env = { ASSETS: makeAssets(DIST) }

/** @param {string} path @param {RequestInit} [init] */
const get = (path, init = {}) => worker.fetch(new Request(ORIGIN + path, init), env)

const BROWSER = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8'

describe('Accept parsing', () => {
  test('reads media ranges and q values', () => {
    assert.deepEqual(parseAccept('text/markdown'), [{ type: 'text', subtype: 'markdown', q: 1 }])
    assert.deepEqual(parseAccept('text/html;q=0.4, */*;q=0.1'), [
      { type: 'text', subtype: 'html', q: 0.4 },
      { type: '*', subtype: '*', q: 0.1 },
    ])
    assert.deepEqual(parseAccept(null), [])
  })

  test('a broken q is ignored rather than fatal', () => {
    assert.deepEqual(parseAccept('text/html;q=banana'), [{ type: 'text', subtype: 'html', q: 1 }])
  })

  test('the most specific range wins', () => {
    const ranges = parseAccept('*/*;q=0.2, text/*;q=0.5, text/markdown;q=0.9')
    assert.equal(quality(ranges, 'text/markdown'), 0.9)
    assert.equal(quality(ranges, 'text/html'), 0.5)
    assert.equal(quality(ranges, 'application/json'), 0.2)
  })

  test('an exact range is distinguished from a wildcard', () => {
    const ranges = parseAccept('*/*')
    assert.equal(quality(ranges, 'text/markdown'), 1)
    assert.equal(explicitQuality(ranges, 'text/markdown'), 0)
  })
})

describe('markdown preference', () => {
  test('named markdown wins', () => {
    assert.equal(wantsMarkdown('text/markdown'), true)
    assert.equal(wantsMarkdown('text/markdown, text/html;q=0.5'), true)
    assert.equal(wantsMarkdown('text/html;q=0.5, text/markdown;q=0.9'), true)
  })

  test('a wildcard is not a request for markdown', () => {
    assert.equal(wantsMarkdown('*/*'), false)
    assert.equal(wantsMarkdown(null), false)
    assert.equal(wantsMarkdown(BROWSER), false)
  })

  test('lower-rated markdown loses to HTML', () => {
    assert.equal(wantsMarkdown('text/markdown;q=0.5, text/html;q=0.9'), false)
    assert.equal(wantsMarkdown('text/markdown;q=0'), false)
  })
})

describe('markdown twin paths', () => {
  test('a page maps to its twin, with or without a trailing slash', () => {
    assert.equal(markdownTwin('/'), '/index.md')
    assert.equal(markdownTwin('/why'), '/why.md')
    assert.equal(markdownTwin('/why/'), '/why.md')
    assert.equal(markdownTwin('/docs/quickstart/'), '/docs/quickstart.md')
  })

  test('anything with an extension is its own representation', () => {
    for (const p of ['/llms.txt', '/openapi.json', '/favicon.svg', '/why.md', '/sitemap-index.xml']) {
      assert.equal(markdownTwin(p), null, p)
    }
  })

  test('build assets are never negotiated', () => {
    assert.equal(markdownTwin('/_astro/x'), null)
    assert.equal(markdownTwin('/pagefind/pagefind.js'), null)
  })
})

describe('error representation', () => {
  test('the machine surface is always JSON', () => {
    for (const p of ['/api', '/api/v1/parse', '/openapi.json', '/errors/x.json', '/.well-known/mcp']) {
      assert.equal(isMachinePath(p), true, p)
      assert.equal(errorFormat(BROWSER, p), 'json', p)
    }
    assert.equal(isMachinePath('/why'), false)
  })

  test('a browser gets HTML, a bare client gets markdown', () => {
    assert.equal(errorFormat(BROWSER, '/nope'), 'html')
    assert.equal(errorFormat('*/*', '/nope'), 'markdown')
    assert.equal(errorFormat(null, '/nope'), 'markdown')
  })

  test('a named preference is honoured', () => {
    assert.equal(errorFormat('application/json', '/nope'), 'json')
    assert.equal(errorFormat('text/markdown', '/nope'), 'markdown')
    assert.equal(errorFormat('text/html', '/nope'), 'html')
  })
})

describe('serving pages', () => {
  test('HTML is served by default, and marked as negotiable', async () => {
    const res = await get('/', { headers: { accept: BROWSER } })
    assert.equal(res.status, 200)
    assert.match(res.headers.get('content-type'), /text\/html/)
    assert.match(res.headers.get('vary'), /\bAccept\b/)
    assert.match(res.headers.get('link'), /<\/index\.md>; rel="alternate"; type="text\/markdown"/)
    assert.match(await res.text(), /<!DOCTYPE html>/i)
  })

  test('Accept: text/markdown returns markdown from the same URL', async () => {
    const res = await get('/', { headers: { accept: 'text/markdown' } })
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8')
    assert.match(res.headers.get('vary'), /\bAccept\b/)
    assert.equal(res.headers.get('content-location'), '/index.md')
    const body = await res.text()
    assert.match(body, /^---\ntitle: /)
    assert.doesNotMatch(body, /<html|<script/i)
  })

  test('every page negotiates, not just the home page', async () => {
    for (const path of ['/why/', '/agents/', '/docs/quickstart/', '/how-to/parse-errors/', '/api/']) {
      const res = await get(path, { headers: { accept: 'text/markdown' } })
      assert.equal(res.status, 200, path)
      assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8', path)
      assert.match(await res.text(), /^---\ntitle: /, path)
    }
  })

  test('a wildcard Accept still gets HTML', async () => {
    const res = await get('/', { headers: { accept: '*/*' } })
    assert.match(res.headers.get('content-type'), /text\/html/)
    assert.match(res.headers.get('vary'), /\bAccept\b/)
  })

  test('the trailing-slash redirect is passed through', async () => {
    const res = await get('/why')
    assert.equal(res.status, 307)
    assert.equal(res.headers.get('location'), '/why/')
  })

  test('pageForTwin is the inverse of markdownTwin', () => {
    assert.equal(pageForTwin('/index.md'), '/')
    assert.equal(pageForTwin('/why.md'), '/why/')
    assert.equal(pageForTwin('/docs/quickstart.md'), '/docs/quickstart/')
    assert.equal(pageForTwin('/skills/build-a-plugin.md'), '/skills/build-a-plugin/')
    // dist/404.html is a file, not a directory, so its page has no slash.
    assert.equal(pageForTwin('/404.md'), '/404')
    for (const p of ['/llms.txt', '/openapi.json', '/why/', '/']) {
      assert.equal(pageForTwin(p), null, p)
    }
  })

  // The twins are the same content at a second URL, advertised from every
  // page head, so a crawler finds all of them: 194 URLs for 97 pages. The
  // canonical header collapses that without making the twin any less
  // available to something that wants to read it.
  test('a markdown twin names the page it is a copy of', async () => {
    const res = await get('/docs/quickstart.md')
    assert.equal(res.status, 200)
    assert.equal(
      res.headers.get('link'),
      '<https://tabnas.dev/docs/quickstart/>; rel="canonical"',
    )

    const home = await get('/index.md')
    assert.equal(home.headers.get('link'), '<https://tabnas.dev/>; rel="canonical"')
  })

  test('documents that are not copies of a page carry no canonical', async () => {
    // /llms.txt and /robots.txt are `isPublicData` like the twins are, but
    // they are documents in their own right — pointing them at a page would
    // be a claim that they duplicate one.
    for (const path of ['/llms.txt', '/llms-full.txt', '/robots.txt', '/openapi.json']) {
      const res = await get(path)
      assert.doesNotMatch(res.headers.get('link') ?? '', /canonical/, path)
    }
  })

  test('protocol files are not treated as pages', async () => {
    // /.well-known/ holds protocol documents (RFC 8615), not documentation.
    assert.equal(markdownTwin('/.well-known/mcp'), null)
  })

  // /api matches isMachinePath so a probe at /api/v1/whatever gets a JSON
  // error, but it is an ordinary page. Answering it as data dropped its
  // `Vary: Accept`, which is exactly the cache mix-up the negotiation exists
  // to prevent: a cache could hand the HTML to a markdown request.
  test('/api is a page, not data — it negotiates and says so', async () => {
    const res = await get('/api/', { headers: { accept: BROWSER } })
    assert.equal(res.status, 200)
    assert.match(res.headers.get('content-type'), /text\/html/)
    assert.match(res.headers.get('vary'), /\bAccept\b/)
    assert.match(res.headers.get('link'), /<\/api\.md>/)
    assert.equal(res.headers.get('access-control-allow-origin'), null, 'an HTML page is not data')

    const md = await get('/api/', { headers: { accept: 'text/markdown' } })
    assert.equal(md.headers.get('content-type'), 'text/markdown; charset=utf-8')
  })

  test('machine-readable files get the type and CORS the asset server cannot', async () => {
    const manifest = await get('/.well-known/mcp')
    assert.equal(manifest.status, 200)
    assert.equal(manifest.headers.get('content-type'), 'application/json; charset=utf-8')
    assert.equal(manifest.headers.get('access-control-allow-origin'), '*')
    assert.equal(JSON.parse(await manifest.text()).name, 'tabnas')

    const yaml = await get('/openapi.yaml')
    assert.equal(yaml.headers.get('content-type'), 'application/yaml; charset=utf-8')

    for (const path of ['/openapi.json', '/errors.json', '/llms.txt', '/why.md']) {
      const res = await get(path)
      assert.equal(res.headers.get('access-control-allow-origin'), '*', path)
    }
  })

  test('generated files are served as themselves', async () => {
    const openapi = await get('/openapi.json')
    assert.equal(openapi.status, 200)
    assert.equal(JSON.parse(await openapi.text()).openapi, '3.1.0')

    const llms = await get('/llms.txt')
    assert.equal(llms.status, 200)
    assert.match(await llms.text(), /^# tabnas/)
  })

  test('a page with no twin, for a caller that will take only markdown, is a 406', async () => {
    const blind = { ASSETS: makeAssets(DIST, (p) => p === '/faq.md') }
    const res = await worker.fetch(
      new Request(`${ORIGIN}/faq/`, { headers: { accept: 'text/markdown' } }),
      blind,
    )
    assert.equal(res.status, 406)
    const body = JSON.parse(await res.text())
    assert.equal(body.error.code, 'not_acceptable')

    // The same page, for a caller that will also take HTML, is served.
    const ok = await worker.fetch(
      new Request(`${ORIGIN}/faq/`, { headers: { accept: 'text/markdown, text/html;q=0.5' } }),
      blind,
    )
    assert.equal(ok.status, 200)
    assert.match(ok.headers.get('content-type'), /text\/html/)
  })
})

describe('the canonical host', () => {
  test('www redirects to the apex, keeping the path and query', async () => {
    const res = await worker.fetch(new Request('https://www.tabnas.dev/docs/quickstart/?x=1'), env)
    assert.equal(res.status, 301)
    assert.equal(res.headers.get('location'), 'https://tabnas.dev/docs/quickstart/?x=1')
  })

  test('the apex itself is never redirected', async () => {
    const res = await worker.fetch(new Request('https://tabnas.dev/docs/quickstart/'), env)
    assert.equal(res.status, 200)
  })

  test('a host that is not www is left alone', async () => {
    // localhost under `wrangler dev`, and any preview hostname.
    const res = await worker.fetch(new Request('http://localhost:8787/'), env)
    assert.equal(res.status, 200)
  })
})

describe('the 404', () => {
  test('a nonexistent path is a real 404, never a 200', async () => {
    for (const accept of [undefined, '*/*', BROWSER, 'application/json', 'text/markdown']) {
      const res = await get('/no-such-page-xyz', accept ? { headers: { accept } } : {})
      assert.equal(res.status, 404, String(accept))
    }
  })

  test('a bare client gets a markdown body it can act on', async () => {
    const res = await get('/no-such-page-xyz')
    assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8')
    const body = await res.text()
    assert.match(body, /^# 404 /)
    assert.match(body, /\/no-such-page-xyz/)
    for (const [href] of ENTRY_POINTS) {
      assert.ok(body.includes(`(${ORIGIN}${href})`), `404 markdown is missing ${href}`)
    }
  })

  test('a browser gets the designed page', async () => {
    const res = await get('/no-such-page-xyz', { headers: { accept: BROWSER } })
    assert.match(res.headers.get('content-type'), /text\/html/)
    const body = await res.text()
    assert.match(body, /404/)
    for (const [href] of ENTRY_POINTS) {
      assert.ok(body.includes(`href="${href}"`), `404 page is missing ${href}`)
    }
  })

  test('an agent asking for JSON gets a structured error', async () => {
    const res = await get('/no-such-page-xyz', { headers: { accept: 'application/json' } })
    assert.match(res.headers.get('content-type'), /application\/json/)
    const { error } = JSON.parse(await res.text())
    assert.equal(error.status, 404)
    assert.equal(error.code, 'not_found')
    assert.equal(error.message, 'Not Found')
    assert.ok(error.hint.length > 40, 'the hint has to say what to do instead')
    assert.equal(error.openapi, `${ORIGIN}/openapi.json`)
    assert.ok(Object.values(error.resources).includes(`${ORIGIN}/llms.txt`))
  })

  test('the machine surface answers JSON whatever the caller asked for', async () => {
    for (const path of ['/api/v1/parse', '/errors/no-such-code.json', '/.well-known/nope']) {
      const res = await get(path, { headers: { accept: BROWSER } })
      assert.equal(res.status, 404, path)
      assert.match(res.headers.get('content-type'), /application\/json/, path)
      assert.equal(JSON.parse(await res.text()).error.code, 'not_found', path)
    }
  })

  test('errors are never cached', async () => {
    const res = await get('/no-such-page-xyz')
    assert.equal(res.headers.get('cache-control'), 'no-store')
    assert.match(res.headers.get('vary'), /\bAccept\b/)
  })

  // An error body exists so a program can recover from it. Successful public
  // JSON answers cross-origin; an error that does not is unreadable by a
  // browser client at exactly the moment it needs the code and the links.
  test('errors answer cross-origin, in every representation', async () => {
    for (const [path, accept] of [
      ['/errors/nope.json', undefined],
      ['/api/v1/parse', undefined],
      ['/no-such-page-xyz', 'application/json'],
      ['/no-such-page-xyz', undefined],
    ]) {
      const res = await get(path, accept ? { headers: { accept } } : {})
      assert.equal(res.status, 404, path)
      assert.equal(
        res.headers.get('access-control-allow-origin'),
        '*',
        `${path} (${accept ?? 'no Accept'}) blocks a cross-origin reader`,
      )
    }
  })
})

describe('methods', () => {
  test('a 405 is readable cross-origin too', async () => {
    const res = await get('/', { method: 'POST' })
    assert.equal(res.headers.get('access-control-allow-origin'), '*')
  })

  test('a write is a structured 405 with an Allow header', async () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const res = await get('/', { method })
      assert.equal(res.status, 405, method)
      assert.equal(res.headers.get('allow'), 'GET, HEAD, OPTIONS', method)
      const { error } = JSON.parse(await res.text())
      assert.equal(error.code, 'method_not_allowed')
      assert.match(error.hint, new RegExp(method))
    }
  })

  test('OPTIONS answers without a body', async () => {
    const res = await get('/', { method: 'OPTIONS' })
    assert.equal(res.status, 204)
    assert.equal(res.headers.get('allow'), 'GET, HEAD, OPTIONS')
  })

  test('HEAD works, including on a negotiated markdown twin', async () => {
    const res = await get('/why/', { method: 'HEAD', headers: { accept: 'text/markdown' } })
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8')
  })
})
