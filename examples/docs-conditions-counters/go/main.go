package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

var seen int

// `N` on an alternate sets or increments a named counter, and counters
// propagate to pushed and repeated rules. Setting 0 RESETS; any other number
// adds.
func build(step int) *tabnas.Tabnas {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"fixed": map[string]any{"token": map[string]any{"#OP": "(", "#CP": ")"}},
		"rule":  map[string]any{"start": "val"},
	}))
	OP, CP, NR := j.Token("#OP"), j.Token("#CP"), j.Token("#NR")

	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(
			&tabnas.AltSpec{S: [][]tabnas.Tin{{OP}}, P: "val", N: map[string]int{"depth": step}},
			&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}, A: func(r *tabnas.Rule, ctx *tabnas.Context) {
				seen = r.N["depth"]
			}},
		)
		rs.AddClose(&tabnas.AltSpec{S: [][]tabnas.Tin{{CP}}}, &tabnas.AltSpec{})
	})
	return j
}

func depthAt(step int, src string) int {
	if _, err := build(step).Parse(src); err != nil {
		panic(err)
	}
	return seen
}

func main() {
	for _, src := range []string{"1", "(1)", "((1))"} {
		fmt.Printf("n:{depth:1}  %-6s depth at the number = %d\n", src, depthAt(1, src))
	}
	fmt.Println("n:{depth:0}  ((1))  depth at the number =", depthAt(0, "((1))"))
}
