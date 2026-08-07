package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

var mark string

// Several keys in one `C` are ANDed — every one must hold.
func check(depth int, mode string) string {
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
					{S: "#NR", N: map[string]int{"depth": depth}, U: map[string]any{"mode": mode}},
				},
				Close: []*tabnas.GrammarAltSpec{
					{C: map[string]any{"n.depth": tabnas.CGte(1), "u.mode": tabnas.CEq("strict")}, A: "@taken"},
					{A: "@skipped"},
				},
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
	fmt.Println("depth=1 mode=strict ", check(1, "strict"))
	fmt.Println("depth=1 mode=loose  ", check(1, "loose"))
	fmt.Println("depth=0 mode=strict ", check(0, "strict"))
}
