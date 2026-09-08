import { test } from "node:test";
import assert from "node:assert/strict";
import { extract, findings, rules } from "../tools/prose.mjs";

const banned = rules("# vocabulary\nworth noting\nseamless(?:ly)?\n");

test("prose checks metadata, labels, and phrases split across markup or lines", () => {
  const { blocks } = extract(`<html><head><meta name="description" content="seamless results"></head><body>
    <p>It is worth\n<strong>noting</strong> the result.</p>
    <button aria-label="Choose — option">Run</button></body></html>`);
  const hits = findings(blocks, banned);
  assert.equal(hits.length, 3);
  assert.ok(hits.some((s) => s.startsWith("worth noting:")));
  assert.ok(hits.some((s) => s.startsWith("em dash:")));
});

test("literal examples, scripts, SVG output, and code identifiers are excluded", () => {
  const { blocks, html } = extract(`<html><body>
    <script>"seamless"</script><pre>worth noting —</pre><svg><text>seamless</text></svg>
    <p>Use <code>seamless</code> as the key.</p><textarea>worth noting</textarea>
    </body></html>`);
  assert.deepEqual(findings(blocks, banned), []);
  assert.ok(html.includes("<code>seamless</code>"), "Vale receives code markup");
  assert.ok(!html.includes("<pre>"));
});

test("invalid vocabulary patterns fail instead of being silently skipped", () => {
  assert.throws(() => rules("["), SyntaxError);
});

test("metadata keeps displayed identifiers as code, including a trailing colon", () => {
  const { html, blocks } = extract(`<html><head><title>relation_cycle: error code</title>
    <meta name="description" content="The relation_cycle code reports a cycle."></head>
    <body><h1><code>relation_cycle</code></h1><nav><a href="/">seamless navigation</a></nav></body></html>`);
  assert.ok(html.includes("<code>relation_cycle</code>: error code"));
  assert.ok(html.includes("The <code>relation_cycle</code> code"));
  assert.equal(findings(blocks, banned).length, 1, "direct navigation links are checked");
});


test("internal records are detected in code-formatted prose and descriptive links", () => {
  const { internalReferences } = extract(`<html><body>
    <p>See <code>BUGS.md</code>.</p>
    <a href="https://github.com/example/docs/design/PLAN.md">design record</a>
    <pre>BUGS.md</pre></body></html>`);
  assert.deepEqual(internalReferences, ["BUGS.md", "docs/design/"]);
  assert.deepEqual(extract(`<html><body><pre>BUGS.md</pre>
    <p>Generate an <code>AGENTS.md</code> file.</p></body></html>`).internalReferences, []);
});


test("introductory list text remains checked when the item contains nested paragraphs", () => {
  const { blocks } = extract('<html><body><ul><li>seamless results<p>Explanation.</p></li></ul></body></html>');
  assert.equal(findings(blocks, banned).length, 1);
});
