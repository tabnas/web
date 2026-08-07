package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	_, err := abnf.Install(j, `
  list  = item *( COMMA item )
  item  = 1*ALPHA
  COMMA = ","
`, nil, nil)
	if err != nil {
		panic(err)
	}

	// Whatever the grammar, a parse returns the same { rule, src, kids } node —
	// which is why a walker written once works for every language you define.
	for _, src := range []string{"a", "a,bc,def"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		n := out.(map[string]any)
		fmt.Printf("rule=%s src=%q\n", n["rule"], n["src"])
	}
}
