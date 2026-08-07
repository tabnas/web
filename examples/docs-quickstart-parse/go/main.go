package main

import (
	"fmt"
	"strings"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

// Every parse has the same { rule, src, kids } shape, so one walker prints any
// tree from any grammar.
func show(node any, depth int) {
	n := node.(map[string]any)
	fmt.Printf("%s%s %q\n", strings.Repeat("  ", depth), n["rule"], n["src"])
	for _, kid := range n["kids"].([]any) {
		show(kid, depth+1)
	}
}

func main() {
	j := tabnas.Make()

	_, err := abnf.Install(j, `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, nil, nil)
	if err != nil {
		panic(err)
	}

	out, err := j.Parse("1+2")
	if err != nil {
		panic(err)
	}
	show(out, 0)
}
