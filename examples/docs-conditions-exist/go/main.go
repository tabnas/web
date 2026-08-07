package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

var existed, isZero bool

// `Eq("k", 0)` is true both for a counter set to 0 and for one never set.
// `Exist` is the only way to tell those two apart.
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
				existed, isZero = r.Exist("depth"), r.Eq("depth", 0)
			}},
		)
		rs.AddClose(&tabnas.AltSpec{S: [][]tabnas.Tin{{CP}}}, &tabnas.AltSpec{})
	})
	return j
}

func main() {
	cases := []struct {
		label string
		step  int
		src   string
	}{
		{"never set", 1, "1"},
		{"set to 0 ", 0, "(1)"},
		{"counted 1", 1, "(1)"},
	}
	for _, c := range cases {
		if _, err := build(c.step).Parse(c.src); err != nil {
			panic(err)
		}
		fmt.Printf("%s  exist: %-5v  eq(depth,0): %v\n", c.label, existed, isZero)
	}
}
