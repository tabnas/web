package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	// A ref is a string starting with `@`; a trailing `$` marks an engine builtin.
	j := tabnas.Make()
	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{"rule": map[string]any{"start": "val"}},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open:  []*tabnas.GrammarAltSpec{{S: "#NR", A: "@value$"}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
		},
	})
	if err != nil {
		panic(err)
	}
	out, err := j.Parse("42")
	if err != nil {
		panic(err)
	}
	fmt.Println("42 =>", out)

	// The `$` namespace is reserved, so a grammar cannot shadow a builtin with a
	// ref of its own.
	shadow := tabnas.Make().Grammar(&tabnas.GrammarSpec{
		Ref: map[tabnas.FuncRef]any{
			"@my$thing": tabnas.AltAction(func(r *tabnas.Rule, ctx *tabnas.Context) { r.Node = 1 }),
		},
		OptionsMap: map[string]any{"rule": map[string]any{"start": "val"}},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open:  []*tabnas.GrammarAltSpec{{S: "#NR", A: "@my$thing"}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
		},
	})
	fmt.Println("user ref containing '$' refused:", shadow != nil)
}
