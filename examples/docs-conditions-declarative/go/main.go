package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	// `C` also takes an OBJECT: a check against a dot-path on the rule instance.
	// No closure, so the grammar is still data — this one has no functions at all.
	j := tabnas.Make()
	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{
			"fixed": map[string]any{"token": map[string]any{"#OP": "(", "#CP": ")"}},
			"rule":  map[string]any{"start": "val"},
		},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open: []*tabnas.GrammarAltSpec{
					{S: "#OP", P: "val", N: map[string]int{"depth": 1},
						C: map[string]any{"n.depth": tabnas.CLt(3)}},
					{S: "#NR"},
				},
				Close: []*tabnas.GrammarAltSpec{{S: "#CP"}, {}},
			},
		},
	})
	if err != nil {
		panic(err)
	}

	// Past three levels the push alternate no longer applies, and nothing else
	// matches an opening bracket.
	for _, src := range []string{"1", "(1)", "((1))", "(((1)))", "((((1))))"} {
		verdict := "accepted"
		if _, err := j.Parse(src); err != nil {
			verdict = "rejected"
		}
		fmt.Printf("%-10s %s\n", src, verdict)
	}
}
