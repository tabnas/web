package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"fixed": map[string]any{"token": map[string]any{"#EQ": "="}},
		"rule":  map[string]any{"start": "pair"},
	}))

	// Go names tokens by their numeric id, so look the three up once.
	TX, EQ, NR := j.Token("#TX"), j.Token("#EQ"), j.Token("#NR")

	// `r.O0` is the token that opened the rule; `r.Child` is the rule that just
	// closed beneath it — which is why the assembly happens in the close phase.
	j.Rule("pair", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{TX}, {EQ}}, P: "val"})
		rs.AddClose(&tabnas.AltSpec{A: func(r *tabnas.Rule, ctx *tabnas.Context) {
			r.Node = map[string]any{"key": r.O0.Src, "value": r.Child.Node}
		}})
	})

	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}, A: func(r *tabnas.Rule, ctx *tabnas.Context) {
			r.Node = r.O0.Val
		}})
	})

	out, err := j.Parse("port = 8080")
	if err != nil {
		panic(err)
	}
	n := out.(map[string]any)
	fmt.Printf("key=%v value=%v\n", n["key"], n["value"])
}
