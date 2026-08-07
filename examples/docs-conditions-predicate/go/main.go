package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"fixed": map[string]any{"token": map[string]any{"#OP": "(", "#CP": ")"}},
		"rule":  map[string]any{"start": "val"},
	}))

	OP, CP, NR := j.Token("#OP"), j.Token("#CP"), j.Token("#NR")
	setNumber := func(r *tabnas.Rule, ctx *tabnas.Context) { r.Node = r.O0.Val }

	// `C` is checked when an alternate's tokens match. If it returns false the
	// alternate is skipped and the next one is tried.
	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(
			&tabnas.AltSpec{S: [][]tabnas.Tin{{OP}}, P: "val"},
			&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}, A: setNumber},
		)
		rs.AddClose(
			// Only a val that opened on '(' may consume ')'.
			&tabnas.AltSpec{
				S: [][]tabnas.Tin{{CP}},
				C: func(r *tabnas.Rule, ctx *tabnas.Context) bool { return OP == r.O0.Tin },
				A: func(r *tabnas.Rule, ctx *tabnas.Context) { r.Node = []any{r.Child.Node} },
			},
			&tabnas.AltSpec{},
		)
	})

	for _, src := range []string{"1", "(1)", "((1))"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		b, _ := json.Marshal(out)
		fmt.Printf("%-6s => %s\n", src, string(b))
	}
}
