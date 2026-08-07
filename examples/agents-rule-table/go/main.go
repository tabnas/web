package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	// The rule table, exactly as data — no code anywhere in it.
	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{
			"fixed": map[string]any{"token": map[string]any{"#PL": "+"}}, // custom fixed tokens
			"rule":  map[string]any{"start": "val"},                      // where parsing begins
		},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open:  []*tabnas.GrammarAltSpec{{P: "add"}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
			"add": {
				Open:  []*tabnas.GrammarAltSpec{{S: "#NR"}},
				Close: []*tabnas.GrammarAltSpec{{S: "#PL", R: "add"}, {}},
			},
		},
	})
	if err != nil {
		panic(err)
	}

	// A grammar is only known to work when the bad inputs fail too.
	for _, src := range []string{"1", "1+2", "1+2+3", "1+", "+1"} {
		verdict := "accept"
		if _, err := j.Parse(src); err != nil {
			verdict = "reject"
		}
		fmt.Printf("%-6s %s\n", src, verdict)
	}
}
