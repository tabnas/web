package main

import (
	"fmt"

	tabnasjson "github.com/tabnas/json/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	if err := j.Use(tabnasjson.Json); err != nil {
		panic(err)
	}

	// A token carries its source text, its resolved value, and where it was
	// found. `Src` and `Val` are not the same thing: for #NR, `Src` is the
	// string "42" and `Val` is the number 42.
	j.Sub(func(t *tabnas.Token, r *tabnas.Rule, ctx *tabnas.Context) {
		if "#ST" != t.Name && "#NR" != t.Name {
			return
		}
		fmt.Printf("%s %-4s %-3s %d %d\n", t.Name, t.Src, fmt.Sprintf("%v", t.Val), t.RI, t.CI)
	}, nil)

	if _, err := j.Parse(`{"a": 42}`); err != nil {
		panic(err)
	}
}
