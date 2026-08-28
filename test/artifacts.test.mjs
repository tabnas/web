// What the build actually put on disk.
//
// The Worker tests cover behaviour; these cover the files that behaviour
// serves — the OpenAPI document, the JSON-LD, the markdown twins, robots.txt,
// the MCP manifest, and the pages an agent checks before recommending a
// project. Everything is asserted against ./dist, so a page or an endpoint
// that stops being generated fails here rather than in production.
//
// Requires a build: `npm run build` before `npm test`.

import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { parse as parseYaml } from 'yaml'
import Ajv2020 from 'ajv/dist/2020.js'

import { AGENT_NAV, PROJECT_NAV, NAV } from '../src/consts.ts'
import { markdownTwin } from '../src/worker.ts'
import { sourcesFor } from '../tools/lastmod.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const ORIGIN = 'https://tabnas.dev'
const SKIP = new Set(['_astro', '_worker.js', 'pagefind', 'fonts', 'brand', 'diagrams'])

const read = (rel) => readFileSync(join(DIST, rel), 'utf8')
const readJson = (rel) => JSON.parse(read(rel))

function walk(dir, ext, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (!SKIP.has(entry)) walk(full, ext, out)
    } else if (entry.endsWith(ext)) {
      out.push(relative(DIST, full).split(sep).join('/'))
    }
  }
  return out
}

/** The visible text of a built page's content region. */
function pageText(rel) {
  const { document } = parseHTML(read(rel))
  for (const el of document.querySelectorAll('script,style,nav,header,footer')) el.remove()
  const region = document.querySelector('[data-pagefind-body]') ?? document.querySelector('main')
  return (region?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

before(() => {
  assert.ok(existsSync(join(DIST, 'index.html')), 'dist/ is missing — run `npm run build`')
})

describe('markdown twins', () => {
  const pages = walk(DIST, '.html')

  test('every built page has one', () => {
    for (const page of pages) {
      const route = page === 'index.html' ? '/' : '/' + page.replace(/(?:\/)?index\.html$|\.html$/, '')
      const twin = markdownTwin(route)
      assert.ok(twin, `${page}: no twin path for ${route}`)
      assert.ok(existsSync(join(DIST, twin)), `${page}: ${twin} was not generated`)
    }
    assert.ok(pages.length > 50, 'suspiciously few pages were built')
  })

  test('each is clean markdown with frontmatter and a heading', () => {
    for (const twin of walk(DIST, '.md')) {
      const body = read(twin)
      assert.match(body, /^---\ntitle: "/, `${twin}: no frontmatter`)
      assert.match(body, /\nsource: "https:\/\//, `${twin}: no canonical source`)
      assert.match(body, /^# /m, `${twin}: no top-level heading`)
      assert.doesNotMatch(body, /<script|<style|<div |<nav /i, `${twin}: HTML leaked through`)
    }
  })

  test('site links resolved to absolute URLs', () => {
    assert.match(read('mcp.md'), /\]\(https:\/\/tabnas\.dev\/skills\/\)/)
  })

  // The twin is what an agent reads instead of the page, so a link the page
  // has and the twin does not is content the agent cannot reach. This caught
  // `data-pagefind-ignore` being treated as "not content": /how-to.md had one
  // guide link where the page has twelve.
  test('every internal link on a page survives into its twin', () => {
    // Only the drops that can contain a link, mirrored from
    // tools/gen-markdown.mjs. Widening that list should mean widening this
    // one — deliberately, which is the point.
    const DROPPED = ['script', 'style', 'nav', 'form', 'svg', '.heading-anchor', '[aria-hidden="true"]']
    const losses = []

    for (const page of pages) {
      const route = page === 'index.html' ? '/' : '/' + page.replace(/(?:\/)?index\.html$|\.html$/, '')
      const twin = markdownTwin(route)
      const { document } = parseHTML(read(page))
      for (const selector of DROPPED) {
        for (const el of document.querySelectorAll(selector)) el.remove()
      }
      const region =
        document.querySelector('[data-pagefind-body]') ?? document.querySelector('main')
      if (!region) continue

      const md = read(twin)
      const hrefs = new Set(
        [...region.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
      )
      const missing = [...hrefs].filter((href) => !md.includes(ORIGIN + href))
      if (missing.length) losses.push(`${twin} is missing ${missing.length}: ${missing.slice(0, 5).join(' ')}`)
    }

    assert.deepEqual(losses, [], 'markdown twins dropped links their pages carry')
  })

  test('/how-to.md indexes every guide, not just the heading', () => {
    const md = read('how-to.md')
    const guides = readdirSync(join(ROOT, 'src', 'content', 'howto')).filter((f) => f.endsWith('.md'))
    for (const guide of guides) {
      const slug = guide.replace(/\.md$/, '')
      assert.ok(md.includes(`${ORIGIN}/how-to/${slug}`), `/how-to.md does not link ${slug}`)
    }
    assert.ok(guides.length >= 10)
  })
})

describe('the OpenAPI document', () => {
  const doc = readJson('openapi.json')
  const operations = Object.entries(doc.paths).flatMap(([path, item]) =>
    Object.entries(item).map(([method, op]) => ({ path, method, op })),
  )

  test('is OpenAPI 3.1 with the identifying fields filled in', () => {
    assert.equal(doc.openapi, '3.1.0')
    assert.equal(doc.info.title, 'tabnas.dev')
    assert.ok(doc.info.version)
    assert.ok(doc.info.description.length > 200)
    assert.ok(doc.info.contact.email)
    assert.equal(doc.info.license.identifier, 'MIT')
    assert.ok(doc.servers.length >= 1)
    assert.equal(doc.servers[0].url, ORIGIN)
  })

  test('describes a real surface', () => {
    assert.ok(operations.length >= 8, 'too few operations to be a description of anything')
    for (const path of ['/llms.txt', '/versions.json', '/errors.json', '/.well-known/mcp', '/openapi.json']) {
      assert.ok(doc.paths[path], `${path} is served but not described`)
    }
  })

  // Function-calling formats key on these: a unique name, a description, and
  // typed arguments. An operation missing any of them is not callable.
  test('every operation has a unique operationId, a summary and a description', () => {
    const seen = new Set()
    for (const { path, method, op } of operations) {
      const where = `${method.toUpperCase()} ${path}`
      assert.ok(op.operationId, `${where}: no operationId`)
      assert.match(op.operationId, /^[a-z][A-Za-z0-9]*$/, `${where}: operationId is not a safe name`)
      assert.ok(!seen.has(op.operationId), `${where}: duplicate operationId ${op.operationId}`)
      seen.add(op.operationId)
      assert.ok(op.summary, `${where}: no summary`)
      assert.ok(op.description?.length > 40, `${where}: description too thin to act on`)
      assert.ok(op.tags?.length, `${where}: no tag`)
    }
  })

  test('every parameter is typed and described', () => {
    for (const { path, method, op } of operations) {
      for (const parameter of op.parameters ?? []) {
        const where = `${method.toUpperCase()} ${path} (${parameter.name})`
        assert.ok(parameter.description, `${where}: no description`)
        assert.ok(parameter.schema?.type, `${where}: no type`)
        assert.ok(parameter.in, `${where}: no location`)
        if (parameter.in === 'path') assert.equal(parameter.required, true, `${where}: path params are required`)
      }
    }
  })

  test('every response carries a schema', () => {
    for (const { path, method, op } of operations) {
      const where = `${method.toUpperCase()} ${path}`
      assert.ok(Object.keys(op.responses).length, `${where}: no responses`)
      for (const [status, response] of Object.entries(op.responses)) {
        assert.ok(response.description, `${where} ${status}: no description`)
        if (status === '204') continue
        const media = Object.values(response.content ?? {})
        assert.ok(media.length, `${where} ${status}: no content`)
        for (const m of media) assert.ok(m.schema, `${where} ${status}: no schema`)
      }
    }
  })

  test('every $ref resolves', () => {
    const refs = new Set()
    JSON.stringify(doc, (key, value) => {
      if (key === '$ref') refs.add(value)
      return value
    })
    for (const ref of refs) {
      assert.match(ref, /^#\/components\/schemas\//, `unsupported $ref: ${ref}`)
      const name = ref.split('/').pop()
      assert.ok(doc.components.schemas[name], `dangling $ref: ${ref}`)
    }
    assert.ok(refs.has('#/components/schemas/Error'), 'the error shape is not referenced anywhere')
  })

  test('every component schema is described and typed', () => {
    for (const [name, schema] of Object.entries(doc.components.schemas)) {
      // Either a typed object, or a composition of them — ErrorCodeDocument
      // is one entry plus the two fields every generated document carries,
      // which is an allOf and has no type of its own.
      const composed = schema.allOf ?? schema.oneOf ?? schema.anyOf
      if (composed) {
        assert.ok(Array.isArray(composed) && composed.length >= 2, `${name}: thin composition`)
        assert.ok(schema.description, `${name}: a composition needs a description`)
        continue
      }
      assert.ok(schema.type, `${name}: no type`)
      assert.ok(schema.properties, `${name}: no properties`)
    }
  })

  test('the error contract is spelled out', () => {
    const error = doc.components.schemas.Error.properties.error
    assert.deepEqual(error.required, ['status', 'code', 'message', 'hint'])
    assert.deepEqual(error.properties.code.enum, ['not_found', 'method_not_allowed', 'not_acceptable'])
  })

  test('/openapi.yaml is the same document', () => {
    assert.deepEqual(parseYaml(read('openapi.yaml')), doc)
  })

  // A root `servers` entry applies to every operation that does not override
  // it, so a second one here advertised https://mcp.tabnas.dev/errors.json —
  // a URL that does not exist. The two operations really on that host carry
  // their own override.
  test('the root server list is this site alone', () => {
    assert.equal(doc.servers.length, 1)
    assert.equal(doc.servers[0].url, ORIGIN)
    const elsewhere = operations.filter((o) => o.op.servers)
    assert.ok(elsewhere.length >= 2, 'the MCP operations should override the server')
    for (const { path, op } of elsewhere) {
      assert.equal(op.servers[0].url, 'https://mcp.tabnas.dev', path)
    }
  })
})

// A published schema that does not describe the response is worse than no
// schema: a generated client rejects a valid answer. This validates the real
// bytes the build produced against the document the build also produced, so
// the two cannot drift. It was added because they had — the ErrorCode schema
// declared a `package` field the response never had, omitted `engine`,
// `packages` and `abi`, and required a `message` that is null for every
// plugin-only code.
describe('responses conform to their published schemas', () => {
  const doc = readJson('openapi.json')
  const ajv = new Ajv2020({ strict: false, allErrors: true })
  ajv.addFormat('uri', true)
  ajv.addSchema({ components: doc.components }, 'oas')

  const CASES = [
    ['versions.json', 'Versions'],
    ['packages.json', 'PackageCatalogue'],
    ['errors.json', 'ErrorRegistry'],
    ['.well-known/mcp', 'McpManifest'],
    // An engine code, a plugin-only code (null message), and one claimed by
    // both an engine catalogue and a C ABI.
    ['errors/unexpected.json', 'ErrorCodeDocument'],
    ['errors/bad_entity_ref.json', 'ErrorCodeDocument'],
    ['errors/internal.json', 'ErrorCodeDocument'],
  ]

  for (const [file, schema] of CASES) {
    test(`/${file} matches ${schema}`, () => {
      const validate = ajv.getSchema(`oas#/components/schemas/${schema}`)
      assert.ok(validate, `${schema} is not in the document`)
      const ok = validate(readJson(file))
      const detail = (validate.errors ?? [])
        .map((e) => `${e.instancePath || '/'} ${e.message} ${JSON.stringify(e.params)}`)
        .join('\n    ')
      assert.ok(ok, `/${file} does not match its own schema:\n    ${detail}`)
    })
  }

  test('every error code resolves to a document that matches', () => {
    // The three sampled above are the interesting shapes; this covers the
    // rest, so a code with an unforeseen shape cannot slip through.
    const validate = ajv.getSchema('oas#/components/schemas/ErrorCodeDocument')
    for (const entry of readJson('errors.json').codes) {
      assert.ok(validate(readJson(`errors/${entry.code}.json`)), `${entry.code} does not match`)
    }
  })
})

describe('JSON-LD', () => {
  const graphOf = (rel) => {
    const { document } = parseHTML(read(rel))
    const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')]
    assert.equal(blocks.length, 1, `${rel}: expected exactly one JSON-LD block`)
    const data = JSON.parse(blocks[0].textContent)
    assert.equal(data['@context'], 'https://schema.org')
    return Object.fromEntries(data['@graph'].map((node) => [node['@type'], node]))
  }

  test('the home page identifies the software', () => {
    const app = graphOf('index.html').SoftwareApplication
    assert.ok(app, 'no SoftwareApplication node')
    assert.equal(app.name, 'tabnas')
    assert.equal(app.url, ORIGIN)
    assert.ok(app.description.length > 60)
    assert.equal(app.applicationCategory, 'DeveloperApplication')
    assert.equal(app.offers.price, '0')
    assert.ok(app.offers.priceCurrency)
    assert.equal(app.author['@type'], 'Person')
    assert.ok(app.author.name)
    assert.ok(app.sameAs.includes('https://github.com/tabnas'))
    assert.ok(app.license)
    assert.ok(app.softwareVersion)
  })

  test('the organization can be contacted', () => {
    const org = graphOf('index.html').Organization
    assert.ok(org, 'no Organization node')
    assert.equal(org.name, 'tabnas')
    assert.equal(org.url, ORIGIN)
    assert.match(org.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    assert.ok(org.logo.url.startsWith(ORIGIN))
    assert.ok(org.sameAs.length >= 2)
    assert.ok(Array.isArray(org.contactPoint) && org.contactPoint.length >= 1)
    for (const point of org.contactPoint) {
      assert.equal(point['@type'], 'ContactPoint')
      assert.ok(point.contactType, 'a contactPoint without a contactType answers no question')
      assert.ok(point.email || point.url)
    }
    // The address is deliberately country-only — see ORG in consts.ts. It has
    // to be a real PostalAddress rather than an empty object either way.
    assert.ok(org.address, 'the Organization has no address')
    assert.equal(org.address['@type'], 'PostalAddress')
    assert.ok(org.address.addressCountry, 'a PostalAddress without a country is not an address')
  })

  test('every page carries the identity graph', () => {
    for (const page of ['about/index.html', 'docs/quickstart/index.html', 'errors/unexpected/index.html', '404.html']) {
      const graph = graphOf(page)
      assert.ok(graph.WebSite, `${page}: no WebSite node`)
      assert.ok(graph.Organization, `${page}: no Organization node`)
      assert.ok(graph.WebPage, `${page}: no WebPage node`)
      assert.ok(graph.WebPage.url.startsWith(ORIGIN), page)
      assert.ok(graph.WebPage.name, page)
    }
  })

  test('the markdown twin is advertised in the head', () => {
    const { document } = parseHTML(read('why/index.html'))
    const link = document.querySelector('link[rel="alternate"][type="text/markdown"]')
    assert.ok(link, 'no alternate link')
    assert.equal(link.getAttribute('href'), '/why.md')
  })
})

describe('discovery files', () => {
  test('robots.txt points at the sitemap and the agent index', () => {
    const robots = read('robots.txt')
    assert.match(robots, /^User-agent: \*$/m)
    assert.match(robots, /^Allow: \/$/m)
    assert.match(robots, new RegExp(`^Sitemap: ${ORIGIN}/sitemap-index\\.xml$`, 'm'))
    assert.match(robots, /llms\.txt/)
    // A granted signal is a rights decision, not a formatting detail: pin the
    // exact line so a change to it has to be a deliberate change to this test.
    assert.match(robots, /^Content-Signal: search=yes, ai-input=yes, ai-train=yes$/m)
  })

  test('the sitemap lists the new pages', () => {
    const sitemap = walk(DIST, '.xml')
      .filter((f) => f.startsWith('sitemap-'))
      .map(read)
      .join('')
    for (const path of ['/about/', '/contact/', '/api/']) {
      assert.ok(sitemap.includes(ORIGIN + path), `${path} is missing from the sitemap`)
    }
  })

  test('llms.txt tells an agent when to use this and how to call it', () => {
    const llms = read('llms.txt')
    assert.match(llms, /^## When to use tabnas$/m)
    assert.match(llms, /^Reach for tabnas when:$/m)
    assert.match(llms, /^Reach for something else when:$/m)
    assert.match(llms, /^How to call it, least setup first:$/m)
    assert.match(llms, /^## Machine-readable endpoints$/m)
    for (const url of ['/openapi.json', '/.well-known/mcp', '/errors.json', '/packages.json']) {
      assert.ok(llms.includes(ORIGIN + url), `llms.txt does not mention ${url}`)
    }
    assert.match(llms, /Accept: text\/markdown/)
  })

  test('every navigable page is listed in llms.txt and exists on disk', () => {
    const llms = read('llms.txt')
    for (const { href } of [...NAV, ...PROJECT_NAV, ...AGENT_NAV]) {
      assert.ok(llms.includes(ORIGIN + href), `llms.txt does not list ${href}`)
      const built = href.includes('.')
        ? join(DIST, href.slice(1))
        : join(DIST, href.slice(1), 'index.html')
      assert.ok(existsSync(built), `${href} is linked but was not built`)
    }
  })
})

describe('the MCP manifest', () => {
  const manifest = readJson('.well-known/mcp')
  const tools = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'mcp-tools.json'), 'utf8'))

  test('names the server, both transports, and the tools', () => {
    assert.equal(manifest.name, 'tabnas')
    assert.equal(manifest.registry.name, 'dev.tabnas/mcp')
    assert.equal(manifest.servers.tabnas.type, 'stdio')
    assert.ok(Array.isArray(manifest.servers.tabnas.command))
    assert.equal(manifest.servers['tabnas-hosted'].type, 'streamable-http')
    assert.match(manifest.servers['tabnas-hosted'].url, /^https:\/\/mcp\.tabnas\.dev\//)
    assert.ok(manifest.local.startsWith('npx '))
    assert.ok(manifest.documentation.startsWith(ORIGIN))
    assert.match(manifest.handshake, /^https:\/\/mcp\.tabnas\.dev\/\.well-known\/mcp$/)
  })

  test('the tool list is the one the server ships', () => {
    assert.deepEqual(manifest.tools, tools.tools)
  })

  test('names the command-line tool, which ships in the same package', () => {
    assert.equal(manifest.cli.command, 'tabnas')
    assert.equal(manifest.cli.package, '@tabnas/mcp')
    assert.match(manifest.cli.install, /^npm install -g @tabnas\/mcp$/)
    assert.ok(manifest.cli.subcommands.includes('parse'))
    assert.ok(manifest.cli.documentation.startsWith(ORIGIN))
  })
})

describe('catalogue endpoints', () => {
  test('/versions.json pins the engine', () => {
    const versions = readJson('versions.json')
    assert.ok(versions.engine)
    assert.equal(versions.packages['@tabnas/parser'], versions.engine)
  })

  test('/packages.json describes every package', () => {
    const catalogue = readJson('packages.json')
    assert.equal(catalogue.count, catalogue.packages.length)
    assert.ok(catalogue.count > 20)
    for (const p of catalogue.packages) {
      assert.ok(p.name && p.tier && p.description && p.version, `${p.name}: incomplete`)
      assert.ok(catalogue.tiers[p.tier], `${p.name}: tier ${p.tier} has no label`)
      assert.ok(p.repository.startsWith('https://github.com/tabnas/'))
    }
  })

  test('/errors.json and the per-code files agree', () => {
    const registry = readJson('errors.json')
    assert.equal(registry.count, registry.codes.length)
    assert.ok(registry.count > 20)
    for (const entry of registry.codes) {
      assert.ok(entry.code, 'an entry with no code')
      assert.equal(entry.url, `${ORIGIN}/errors/${entry.code}/`)
      const single = readJson(`errors/${entry.code}.json`)
      assert.equal(single.code, entry.code)
      assert.equal(single.hint, entry.hint)
      assert.ok(existsSync(join(DIST, 'errors', entry.code, 'index.html')), `${entry.code}: no page`)
    }
  })

  test('the error-code enum in the spec is the registry', () => {
    const doc = readJson('openapi.json')
    const registry = readJson('errors.json')
    assert.deepEqual(
      doc.components.schemas.ErrorCode.properties.code.enum,
      registry.codes.map((c) => c.code),
    )
  })
})

describe('the declared runtime', () => {
  test('is new enough for the TypeScript imports these tests use', () => {
    // These suites import .ts source directly. Node strips types without a
    // flag only from 22.18 — on 22.0-22.17 `npm test` dies while loading,
    // before a single test runs, so `>=22` was not a true floor.
    const { engines } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
    const [, major, minor = '0'] = engines.node.match(/(\d+)(?:\.(\d+))?/)
    const enough = Number(major) > 22 || (Number(major) === 22 && Number(minor) >= 18)
    assert.ok(enough, `engines.node is "${engines.node}"; type stripping needs >=22.18`)
  })
})

describe('trust anchors', () => {
  // The pages a person — or an agent asked whether this project is real —
  // looks for. A stub is worse than nothing, so the floor is a real one.
  for (const [page, name] of [
    ['about/index.html', '/about'],
    ['contact/index.html', '/contact'],
    ['privacy/index.html', '/privacy'],
  ]) {
    test(`${name} is a real page`, () => {
      const text = pageText(page)
      assert.ok(text.length >= 500, `${name}: only ${text.length} characters of content`)
    })
  }

  test('/contact publishes a way to make contact', () => {
    const { document } = parseHTML(read('contact/index.html'))
    const mailto = document.querySelector('a[href^="mailto:"]')
    assert.ok(mailto, '/contact has no email address')
    const org = JSON.parse(
      document.querySelector('script[type="application/ld+json"]').textContent,
    )['@graph'].find((n) => n['@type'] === 'Organization')
    assert.ok(
      mailto.getAttribute('href').endsWith(org.email),
      'the address on /contact and the one in the JSON-LD disagree',
    )
  })

  test('/about and /contact are linked from every page', () => {
    const { document } = parseHTML(read('index.html'))
    for (const href of ['/about/', '/contact/']) {
      assert.ok(document.querySelector(`footer a[href="${href}"]`), `${href} is not in the footer`)
    }
  })
})

// Canonical URLs and the sitemap use the trailing-slash form, because
// `build.format: "directory"` writes dist/<page>/index.html and Cloudflare's
// asset server answers the no-slash form with a 307 to it. A link written the
// other way therefore costs a redirect on every crawl and every click, and a
// 307 is temporary — nothing consolidates onto the canonical URL. This is the
// invariant that keeps the two forms from drifting apart again; it failed on
// 3,861 links before the links were rewritten.
describe('internal links are canonical', () => {
  const pages = walk(DIST, '.html')

  // Not pages, and correctly slashless: anything with a file extension,
  // /404 (Astro emits dist/404.html, not a directory), and the RFC 8615
  // protocol documents under /.well-known/.
  const isPage = (path) =>
    path !== '/' &&
    path !== '/404' &&
    !path.startsWith('/.well-known') &&
    !/\.[A-Za-z0-9]+$/.test(path.replace(/\/$/, '').split('/').pop() ?? '')

  test('every internal link ends in a slash, so none of them redirect', () => {
    const offenders = []
    for (const page of pages) {
      const { document } = parseHTML(read(page))
      for (const a of document.querySelectorAll('a[href^="/"]')) {
        const href = a.getAttribute('href')
        if (href.startsWith('//')) continue
        const path = href.split('#')[0].split('?')[0]
        if (!isPage(path) || path.endsWith('/')) continue
        offenders.push(`${page}: ${href}`)
      }
    }
    assert.deepEqual(offenders.slice(0, 20), [], `${offenders.length} link(s) would 307`)
  })

  test('every internal link resolves to a page that was built', () => {
    const missing = []
    for (const page of pages) {
      const { document } = parseHTML(read(page))
      for (const a of document.querySelectorAll('a[href^="/"]')) {
        const href = a.getAttribute('href')
        if (href.startsWith('//')) continue
        const path = href.split('#')[0].split('?')[0]
        const target = isPage(path)
          ? join(DIST, path.replace(/\/$/, ''), 'index.html')
          : join(DIST, path === '/404' ? '404.html' : path.slice(1))
        if (path !== '/' && !existsSync(target)) missing.push(`${page}: ${href}`)
      }
    }
    // This caught /docs/errors, linked from all 46 error pages and never a
    // route: the docs collection has no `errors` entry, so getStaticPaths
    // never emitted one.
    assert.deepEqual([...new Set(missing.map((m) => m.split(': ')[1]))], [], 'links to pages that do not exist')
  })
})

// A description longer than a search result can show is truncated mid-phrase
// by the engine, which picks the cut, not us; one much shorter than that is
// leaving the space empty. 160 characters is the conventional ceiling. The
// floor is deliberately loose: the error-code and skill pages derive their
// description from generated text — a short one there is an honest summary of
// a short source sentence, not a page that forgot to describe itself.
describe('meta descriptions', () => {
  const DESCRIPTION_MAX = 160
  const DESCRIPTION_MIN = 40

  const described = walk(DIST, '.html').map((page) => {
    const { document } = parseHTML(read(page))
    return [page, document.querySelector('meta[name="description"]')?.getAttribute('content')]
  })

  test('every page has one', () => {
    for (const [page, description] of described) {
      assert.ok(description, `${page}: no meta description`)
    }
  })

  test('none is longer than a search result shows', () => {
    const over = described
      .filter(([, d]) => d.length > DESCRIPTION_MAX)
      .map(([page, d]) => `${page}: ${d.length}`)
    assert.deepEqual(over, [], `over ${DESCRIPTION_MAX} characters`)
  })

  test('none is too thin to be a summary', () => {
    const under = described
      .filter(([, d]) => d.length < DESCRIPTION_MIN)
      .map(([page, d]) => `${page}: ${d.length}`)
    assert.deepEqual(under, [], `under ${DESCRIPTION_MIN} characters`)
  })

  // The docs hub renders the introduction, so the two share a title and a
  // description by construction. Everything else describing itself the same
  // way as another page is two pages competing for one result.
  test('no two pages describe themselves identically', () => {
    const seen = new Map()
    for (const [page, description] of described) {
      if (!seen.has(description)) seen.set(description, [])
      seen.get(description).push(page)
    }
    const shared = [...seen.values()]
      .filter((pages) => pages.length > 1)
      .filter((pages) => !(pages.length === 2 && pages.includes('docs/index.html')))
      .map((pages) => pages.join(' == '))
    assert.deepEqual(shared, [])
  })
})

// One <h1> per page, and no level skipped on the way down. /why had four —
// its sections were written as top-level headings, so a 400-line page
// offered no outline to a reader, a screen reader or a search engine.
describe('heading outlines', () => {
  const outline = (page) => {
    const { document } = parseHTML(read(page))
    for (const el of document.querySelectorAll('script,style,nav,header,footer')) el.remove()
    const region =
      document.querySelector('[data-pagefind-body]') ??
      document.querySelector('main') ??
      document.querySelector('body')
    return [...region.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]))
  }

  test('every page has exactly one h1', () => {
    const wrong = walk(DIST, '.html')
      .map((page) => [page, outline(page).filter((l) => l === 1).length])
      .filter(([, n]) => n !== 1)
      .map(([page, n]) => `${page}: ${n}`)
    assert.deepEqual(wrong, [])
  })

  test('no page skips a heading level', () => {
    const skips = []
    for (const page of walk(DIST, '.html')) {
      const levels = outline(page)
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) skips.push(`${page}: h${levels[i - 1]} -> h${levels[i]}`)
      }
    }
    assert.deepEqual(skips, [])
  })
})

describe('cache policy', () => {
  // The asset server's default is `max-age=0, must-revalidate`, which is
  // right for HTML and was also being applied to content-hashed bundles and
  // to fonts preloaded on every page.
  const headers = read('_headers')

  test('content-hashed bundles are immutable', () => {
    assert.match(headers, /^\/_astro\/\*$/m)
    assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/)
  })

  test('the unhashed static files are cached but not immutable', () => {
    for (const prefix of ['/fonts/*', '/brand/*', '/diagrams/*']) {
      assert.ok(headers.includes(prefix), `${prefix} has no cache policy`)
    }
    // A file that keeps its name across deploys must stay replaceable.
    assert.doesNotMatch(headers, /\/fonts\/\*\n\s+Cache-Control:[^\n]*immutable/)
  })

  test('HTML keeps the revalidating default', () => {
    // Naming a page path here would serve readers a stale page after a
    // deploy. The absence is the policy.
    assert.doesNotMatch(headers, /^\/(docs|why|agents)/m)
  })
})

describe('the sitemap', () => {
  const xml = walk(DIST, '.xml')
    .filter((f) => f.startsWith('sitemap-'))
    .map(read)
    .join('')
  const entries = [...xml.matchAll(/<url>(.*?)<\/url>/gs)].map((m) => m[1])

  const dated = entries.filter((e) => e.includes('<lastmod>'))

  // All or nothing. lastmod comes from git history, and a shallow clone —
  // which is what most CI checkouts are, this repo's included — has none to
  // read, so a sitemap with no lastmod at all is a correct outcome and not a
  // failure. What would be wrong is some pages carrying one and others not:
  // that is a mapping that has stopped covering a route.
  test('lastmod is present on every URL or on none', () => {
    assert.ok(entries.length > 50, 'suspiciously few URLs')
    assert.ok(
      dated.length === entries.length || dated.length === 0,
      `${dated.length} of ${entries.length} URLs carry a lastmod`,
    )
  })

  // A lastmod Google does not believe is a lastmod Google discards, for the
  // whole site. These come from git, so they cannot be in the future — and
  // they cannot all be the same instant, which is what a build stamp looks
  // like and also what a shallow clone's boundary commit produces.
  test('the dates are real and not all the same', (t) => {
    if (!dated.length) return t.skip('built from a shallow clone: no history to date pages by')
    const dates = dated.map((e) => e.match(/<lastmod>(.*?)<\/lastmod>/)[1])
    const now = Date.now()
    for (const date of dates) {
      const t = Date.parse(date)
      assert.ok(Number.isFinite(t), `${date} is not a date`)
      assert.ok(t <= now, `${date} is in the future`)
    }
    assert.ok(new Set(dates).size > 5, 'every page claims the same date — that is a build stamp')
  })

  // The map in tools/lastmod.mjs is hand-kept, so a new page rendering from a
  // generated catalogue would otherwise date itself by its own file and sit
  // still while the catalogue moved under it.
  test('a page rendering from a data file is dated by that file', () => {
    const missing = []
    for (const page of walk(DIST, '.html')) {
      if (page === '404.html') continue
      const route = '/' + page.replace(/(?:^|\/)index\.html$|\.html$/, '')
      const source = sourcesFor(route).find(
        (rel) => rel.startsWith('src/pages/') && existsSync(join(ROOT, rel)),
      )
      if (!source) continue
      const imports = readFileSync(join(ROOT, source), 'utf8').matchAll(
        /from\s+"[^"]*\/(data\/[a-z-]+\.json)"/g,
      )
      const sources = sourcesFor(route)
      for (const [, data] of imports) {
        if (!sources.includes(`src/${data}`)) missing.push(`${route} renders from src/${data}`)
      }
    }
    assert.deepEqual([...new Set(missing)], [])
  })

  test('changefreq and priority are absent', () => {
    // Both are ignored by every major engine; emitting them is noise that
    // has to be kept plausible for no return.
    assert.doesNotMatch(xml, /<changefreq>|<priority>/)
  })
})
