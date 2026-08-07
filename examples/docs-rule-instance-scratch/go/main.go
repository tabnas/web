package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"rule": map[string]any{"start": "top"},
	}))

	NR := j.Token("#NR")

	// `U` is scoped to this rule instance; `K` propagates to every rule pushed
	// or repeated below it.
	j.Rule("top", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{
			P: "item",
			U: map[string]any{"onlyHere": 1},
			K: map[string]any{"everywhere": 2},
		})
	})

	j.Rule("item", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}, A: func(r *tabnas.Rule, ctx *tabnas.Context) {
			_, seen := r.U["onlyHere"]
			fmt.Println("item sees u.onlyHere:  ", seen)
			fmt.Println("item sees k.everywhere:", r.K["everywhere"])
		}})
	})

	if _, err := j.Parse("42"); err != nil {
		panic(err)
	}
}
