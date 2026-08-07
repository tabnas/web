package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	// The ABNF text stays valid RFC 5234; the behaviour binds through names the
	// compiler assigns.
	_, err := abnf.Install(j, `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, nil, abnf.ActionsMap{
		// Alternate marks: @<rule>:<phase>:<mark>.
		"@val:o:add": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			r.Node.(map[string]any)["value"] = float64(0)
		}},
		"@add:o:NR": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			node := r.Parent.Node.(map[string]any)
			node["value"] = node["value"].(float64) + r.O[0].Val.(float64)
		}},

		// A rule-phase hook: @<rule>:ac is after-close.
		"@val:ac": {func(r *tabnas.Rule, ctx *tabnas.Context) {
			fmt.Println("val closed with", int(r.Node.(map[string]any)["value"].(float64)))
		}},
	})
	if err != nil {
		panic(err)
	}

	for _, src := range []string{"1+2+3", "12+3+45"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Printf("%-7s => %v\n", src, int(out.(map[string]any)["value"].(float64)))
	}
}
