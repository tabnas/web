Both kinds of name are here: alternate marks (`@val:o:add`, `@add:o:NR`) fire
when that alternate matches, and a rule-phase hook (`@val:ac`) fires after the
rule closes. The ABNF text is untouched and still valid RFC 5234.

Marks come from each alternate's leading discriminator, which the compiler
assigns — ask `tabnas-abnf --marks` for them rather than guessing.
