package main

import (
	"fmt"
	"strings"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	// The rule table itself: options, then rules, each with an open and a close
	// phase holding alternates tried in order.
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

	// `p` pushes (depth grows), `r` repeats (depth stays). The trace shows it:
	// `val` pushes `add` once, then every `+` repeats `add` at the same depth.
	trace := []string{}
	j.Sub(nil, func(r *tabnas.Rule, ctx *tabnas.Context) {
		trace = append(trace, fmt.Sprintf("%s~%s@%d", r.Name, r.State, r.D))
	})
	if _, err := j.Parse("1+2+3"); err != nil {
		panic(err)
	}
	fmt.Println(strings.Join(trace, " "))
}
