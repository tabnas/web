package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	// The grammar stays declarative; the code lives out here, bound by name.
	_, err := abnf.Install(j, `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, nil, abnf.ActionsMap{
		// Rule-phase hook: after 'val' opens, seed the accumulator on its node.
		"@val:ao": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			node := r.Node.(map[string]any)
			node["value"] = float64(0)
			node["count"] = float64(0)
		}},

		// Alternate mark: each number adds to it.
		"@add:o:NR": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			node := r.Parent.Node.(map[string]any)
			node["value"] = node["value"].(float64) + r.O[0].Val.(float64)
			node["count"] = node["count"].(float64) + 1
		}},
	})
	if err != nil {
		panic(err)
	}

	for _, src := range []string{"1", "1+2+3", "12+3+45"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		node := out.(map[string]any)
		fmt.Printf("%s => total %v, terms %v\n",
			src, int(node["value"].(float64)), int(node["count"].(float64)))
	}
}
