package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	_, err := abnf.Install(j, `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, nil, abnf.ActionsMap{
		// `val` holds the running total.
		"@val:o:add": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			r.Node.(map[string]any)["value"] = float64(0)
		}},

		// Each number adds to it.
		"@add:o:NR": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			node := r.Parent.Node.(map[string]any)
			node["value"] = node["value"].(float64) + r.O[0].Val.(float64)
		}},
	})
	if err != nil {
		panic(err)
	}

	// The total rides on the parse, not on an outer variable — so re-parsing the
	// same input gives the same answer, and the instance carries no state.
	for _, src := range []string{"1+2+3", "12+3+45", "1+2+3"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Printf("%-8s => %v\n", src, int(out.(map[string]any)["value"].(float64)))
	}
}
