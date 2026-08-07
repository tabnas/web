package main

import (
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()

	// No functions anywhere: the only action is a builtin, named by string.
	err := j.Grammar(&tabnas.GrammarSpec{
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open:  []*tabnas.GrammarAltSpec{{S: "#NR", A: "@value$"}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
		},
	})
	if err != nil {
		panic(err)
	}

	for _, src := range []string{"42", "3.5", "-7"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Println(src, "=>", out)
	}
}
