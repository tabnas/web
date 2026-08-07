package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"rule": map[string]any{"start": "val"},
	}))
	NR := j.Token("#NR")

	// Nothing has ever incremented `depth`, so it has counted nothing.
	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		rs.AddOpen(&tabnas.AltSpec{S: [][]tabnas.Tin{{NR}}, A: func(r *tabnas.Rule, ctx *tabnas.Context) {
			fmt.Println("lt('depth', 3)   ", r.Lt("depth", 3))
			fmt.Println("eq('depth', 0)   ", r.Eq("depth", 0))
			fmt.Println("gt('depth', 3)   ", r.Gt("depth", 3))
			fmt.Println("exist('depth')   ", r.Exist("depth"))
		}})
	})

	if _, err := j.Parse("42"); err != nil {
		panic(err)
	}
}
