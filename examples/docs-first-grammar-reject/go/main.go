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

	// The step people skip. A grammar that accepts everything looks exactly like
	// a grammar that works, so try the malformed input too.
	for _, src := range []string{"a", "a,bc,def", "a,,b", ",a", "a,"} {
		verdict := "accepted"
		if _, err := j.Parse(src); err != nil {
			verdict = "rejected"
		}
		fmt.Printf("%-11q %s\n", src, verdict)
	}
}
