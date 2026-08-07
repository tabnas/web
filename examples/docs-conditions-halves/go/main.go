package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

var mark string

// One alternate gated on the condition, one unconditional behind it. Nothing
// has set `u.flag`, `n.never` or `u.never`, so each row is the unset case.
func check(cond map[string]any) string {
	j := tabnas.Make()
	err := j.Grammar(&tabnas.GrammarSpec{
		Ref: map[tabnas.FuncRef]any{
			"@taken":   tabnas.AltAction(func(r *tabnas.Rule, ctx *tabnas.Context) { mark = "taken" }),
			"@skipped": tabnas.AltAction(func(r *tabnas.Rule, ctx *tabnas.Context) { mark = "skipped" }),
		},
		OptionsMap: map[string]any{"rule": map[string]any{"start": "val"}},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open: []*tabnas.GrammarAltSpec{
					{S: "#NR", C: cond, A: "@taken"},
					{S: "#NR", A: "@skipped"},
				},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
		},
	})
	if err != nil {
		panic(err)
	}
	if _, err := j.Parse("1"); err != nil {
		panic(err)
	}
	return mark
}

func main() {
	fmt.Println("{ 'u.flag': 1 }              ", check(map[string]any{"u.flag": 1}))
	fmt.Println("{ 'n.never': { $gte: 99 } }  ", check(map[string]any{"n.never": tabnas.CGte(99)}))
	fmt.Println("{ 'n.never': { $lt: 1 } }    ", check(map[string]any{"n.never": tabnas.CLt(1)}))
	fmt.Println("{ 'u.never': { $gte: 99 } }  ", check(map[string]any{"u.never": tabnas.CGte(99)}))
}
