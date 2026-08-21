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

import { AGENT_NAV, PROJECT_NAV, NAV } from '../src/consts.ts'
import { markdownTwin } from '../src/worker.ts'

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
    assert.match(read('mcp.md'), /\]\(https:\/\/tabnas\.dev\/skills\)/)
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
    // The address is the one identity field the project has never published.
    // If it is present it must be a PostalAddress with a country, not a stub.
    if (org.address) {
      assert.equal(org.address['@type'], 'PostalAddress')
      assert.ok(org.address.addressCountry, 'a PostalAddress without a country is not an address')
    }
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
    assert.match(robots, /^Content-Signal: /m)
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
      assert.equal(entry.url, `${ORIGIN}/errors/${entry.code}`)
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
    for (const href of ['/about', '/contact']) {
      assert.ok(document.querySelector(`footer a[href="${href}"]`), `${href} is not in the footer`)
    }
  })
})
