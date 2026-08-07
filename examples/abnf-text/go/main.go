package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

// Plain RFC 5234 ABNF — this is the whole grammar.
const GRAMMAR = `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`

func main() {
	j := tabnas.Make()
	if _, err := abnf.Install(j, GRAMMAR, nil, nil); err != nil {
		panic(err)
	}

	// Compiled, it recognises an addition chain and refuses anything else.
	for _, src := range []string{"1+2+3", "12+3+45", "1+*"} {
		state := "accepted"
		if _, err := j.Parse(src); err != nil {
			state = "rejected"
		}
		fmt.Printf("%-8s %s\n", src, state)
	}
}
