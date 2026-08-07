package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{
			"fixed": map[string]any{"token": map[string]any{"#PL": "+"}},
			"rule":  map[string]any{"start": "val"},
		},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				// Start the accumulator at zero.
				Open: []*tabnas.GrammarAltSpec{{P: "add", A: func(r *tabnas.Rule, ctx *tabnas.Context) {
					r.Node = float64(0)
				}}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
			"add": {
				// Add each number to it.
				Open: []*tabnas.GrammarAltSpec{{S: "#NR", A: func(r *tabnas.Rule, ctx *tabnas.Context) {
					r.Parent.Node = r.Parent.Node.(float64) + r.O[0].Val.(float64)
				}}},
				Close: []*tabnas.GrammarAltSpec{{S: "#PL", R: "add"}, {}},
			},
		},
	})
	if err != nil {
		panic(err)
	}

	for _, src := range []string{"1+2+3", "12+3+45"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Printf("%v\n", int(out.(float64)))
	}
}
