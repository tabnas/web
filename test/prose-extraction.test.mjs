import { test } from "node:test";
import assert from "node:assert/strict";
import { extract, findings, register, rules, TUTORIALS } from "../tools/prose.mjs";

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


test("first person singular passes as a question and fails as a statement", () => {
  const ok = ["Do I have to write ABNF?", "None can answer does this match my grammar?",
    'Half of "my rule never fires" turns out to be a token that never lexed.'];
  assert.deepEqual(register(ok, "faq/"), []);
  const bad = ["I wrote this parser last year."];
  assert.equal(register(bad, "faq/").length, 1);
  assert.ok(register(bad, "faq/")[0].startsWith("first person singular"));
});

test("I/O is not a pronoun", () => {
  assert.deepEqual(register(["The disk I/O is buffered."], "docs/"), []);
});

test('"we" is a tutorial register, and the project speaks for itself', () => {
  const we = ["We'll parse a comma-separated list."];
  assert.deepEqual(register(we, "docs/first-grammar/"), []);
  assert.deepEqual(register(["No cookies are set by us."], "privacy/"), []);
  assert.equal(register(we, "docs/rule-table/").length, 1);
  assert.ok(register(we, "docs/rule-table/")[0].startsWith('"we" outside a tutorial'));
});

test("every tutorial in the list is a real page kind, not a path guess", () => {
  for (const p of TUTORIALS) {
    assert.ok(p.startsWith("docs/") && p.endsWith("/"), `${p} is a page prefix`);
  }
});

test("emoji are refused and exclamation marks are rationed", () => {
  assert.equal(register(["Ship it \u{1F680}"], "docs/").length, 1);
  assert.deepEqual(register(["One is fine!"], "docs/"), []);
  const many = register(["First!", "Second!"], "docs/");
  assert.equal(many.length, 1);
  assert.ok(many[0].includes("exclamation marks"));
});
