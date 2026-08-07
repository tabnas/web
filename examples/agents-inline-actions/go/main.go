package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	plus := "+"
	j := tabnas.Make(tabnas.Options{
		Fixed: &tabnas.FixedOptions{Token: map[string]*string{"#PL": &plus}},
		Rule:  &tabnas.RuleOptions{Start: "val"},
	})

	NR, PL := j.Token("#NR"), j.Token("#PL")

	// Functions written straight onto the alternates: the grammar is now code.
	j.Rule("val", func(rs *tabnas.RuleSpec, _ *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{
			P: "add",
			A: func(r *tabnas.Rule, _ *tabnas.Context) { r.Node = float64(0) },
		})
		rs.AddClose(&tabnas.AltSpec{})
	})

	j.Rule("add", func(rs *tabnas.RuleSpec, _ *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{
			S: [][]tabnas.Tin{{NR}},
			A: func(r *tabnas.Rule, _ *tabnas.Context) {
				r.Parent.Node = r.Parent.Node.(float64) + r.O[0].Val.(float64)
			},
		})
		rs.AddClose(&tabnas.AltSpec{S: [][]tabnas.Tin{{PL}}, R: "add"}, &tabnas.AltSpec{})
	})

	for _, src := range []string{"1", "1+2+3", "12+3+45"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Println(src, "=>", int(out.(float64)))
	}
}
