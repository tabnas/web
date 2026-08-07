package main

import (
	"fmt"
	"strings"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

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

	// You do not have to guess at any of this: subscribe and watch.
	// name~state@depth — two `add` instances at the same depth is a repeat,
	// increasing depth is a push.
	trace := []string{}
	j.Sub(nil, func(r *tabnas.Rule, ctx *tabnas.Context) {
		trace = append(trace, fmt.Sprintf("%s~%s@%d", r.Name, r.State, r.D))
	})
	if _, err := j.Parse("1+2"); err != nil {
		panic(err)
	}
	fmt.Println(strings.Join(trace, " "))
}
