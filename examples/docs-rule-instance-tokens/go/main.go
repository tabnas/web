package main

import (
	"fmt"
	"strings"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"fixed": map[string]any{"token": map[string]any{"#EQ": "="}},
		"rule":  map[string]any{"start": "pair"},
	}))

	TX, EQ, NR := j.Token("#TX"), j.Token("#EQ"), j.Token("#NR")

	// The open phase collects its matched tokens into `r.O`; `r.O0` and `r.O1`
	// are shorthand for the first two, and `r.OS` is how many matched.
	j.Rule("pair", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{TX}, {EQ}}, P: "val"})
		rs.AddClose(&tabnas.AltSpec{A: func(r *tabnas.Rule, ctx *tabnas.Context) {
			srcs := []string{}
			for _, t := range r.O {
				srcs = append(srcs, t.Src)
			}
			fmt.Println("open tokens:", r.OS)
			fmt.Println("first: ", fmt.Sprintf("%q", r.O0.Src))
			fmt.Println("second:", fmt.Sprintf("%q", r.O1.Src))
			fmt.Println("all:   ", strings.Join(srcs, ","))
		}})
	})

	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}})
	})

	if _, err := j.Parse("port = 8080"); err != nil {
		panic(err)
	}
}
