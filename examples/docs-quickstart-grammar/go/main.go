package main

import (
	"fmt"
	"sort"
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

	// What the ABNF compiled to: `val` and `add` are rules, `PL` became a token,
	// and the compiler added a `__start__` wrapper that consumes end-of-source.
	rules := []string{}
	for name := range j.RSM() {
		rules = append(rules, name)
	}
	sort.Strings(rules)
	fmt.Println("rules:", strings.Join(rules, " "))
}
