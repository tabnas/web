import { test } from "node:test";
import assert from "node:assert/strict";
import { extract, findings, register, rules, TUTORIALS } from "../tools/prose.mjs";

const banned = rules("worth noting\nseamless(?:ly)?\n");

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
  // Vale reads a `#` line as a pattern, and a lone `#` bans the
  // character, so a list that carries one is refused rather than
  // filtered: skipping it here would ban different things on each side.
  assert.throws(() => rules("# a note\nworth noting\n"), /comment lines/);
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
    'Half of "my rule never fires" turns out to be a token that never lexed.',
    // An FAQ term states the problem and then asks. The whole block is
    // the reader talking, and splitting it by sentence loses that.
    "My action never fires. Why?"];
  assert.deepEqual(register(ok, "faq/"), []);
  const bad = ["I wrote this parser last year."];
  assert.equal(register(bad, "faq/").length, 1);
  assert.ok(register(bad, "faq/")[0].startsWith("first person singular"));
  // `My` opening a sentence is the same pronoun as `my` inside one.
  assert.equal(register(["My parser is fast."], "docs/").length, 1);
  assert.equal(register(["Mine is faster."], "docs/").length, 1);
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

test("emoji is a presentation, not a block, and a mark ends a sentence", () => {
  // Text presentation: documentation uses these as symbols.
  for (const symbol of ["\u26A0", "\u2713", "\u2194", "\u2020"]) {
    assert.deepEqual(register([`A ${symbol} marker.`], "docs/"), []);
  }
  // Emoji that sit in no symbol block: a variation selector, a keycap,
  // a flag's regional indicators.
  for (const glyph of ["\u2197\uFE0F", "1\uFE0F\u20E3", "\u{1F1EC}\u{1F1E7}"]) {
    assert.equal(register([`Ship it ${glyph}`], "docs/").length, 1);
  }
  // `!=` is an operator, not the end of a sentence, so it does not
  // spend the page's one mark.
  assert.deepEqual(register(["Use a != b and c != d.", "Then it works!"], "docs/"), []);
});
