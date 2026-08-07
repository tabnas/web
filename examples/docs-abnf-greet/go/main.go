package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	if _, err := abnf.Install(j, `greet = "hi" / "hello"`, nil, nil); err != nil {
		panic(err)
	}

	// One line of ABNF is a working parser. Every parse is the same
	// { rule, src, kids } node — and anything else is rejected.
	for _, src := range []string{"hi", "hello", "howdy"} {
		out, err := j.Parse(src)
		if err != nil {
			fmt.Printf("%-6s rejected\n", src)
			continue
		}
		n := out.(map[string]any)
		fmt.Printf("%-6s %s %q kids=%d\n", src, n["rule"], n["src"], len(n["kids"].([]any)))
	}
}
