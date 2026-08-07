package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

func main() {
	// A JSON-shaped parser with not one function in it: every action is a
	// builtin named by string. Search this value for a func literal — there
	// isn't one.
	spec := &tabnas.GrammarSpec{
		OptionsMap: map[string]any{"rule": map[string]any{"start": "val"}},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open: []*tabnas.GrammarAltSpec{
					{S: "#OB", P: "map", B: 1, A: "@object$"},
					{S: "#OS", P: "list", B: 1, A: "@array$"},
					{S: "#VAL", A: "@value$"},
				},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
			"map": {
				Open:  []*tabnas.GrammarAltSpec{{S: []string{"#OB", "#CB"}, B: 1}, {S: "#OB", P: "pair"}},
				Close: []*tabnas.GrammarAltSpec{{S: "#CB"}},
			},
			"pair": {
				Open: []*tabnas.GrammarAltSpec{{S: []string{"#TX", "#CL"}, P: "val", A: "@key$"}},
				Close: []*tabnas.GrammarAltSpec{
					{S: "#CA", R: "pair", A: "@setval$"},
					{S: "#CB", B: 1, A: "@setval$"},
				},
			},
			"list": {
				Open:  []*tabnas.GrammarAltSpec{{S: []string{"#OS", "#CS"}, B: 1}, {S: "#OS", P: "elem"}},
				Close: []*tabnas.GrammarAltSpec{{S: "#CS"}},
			},
			"elem": {
				Open: []*tabnas.GrammarAltSpec{{P: "val"}},
				Close: []*tabnas.GrammarAltSpec{
					{S: "#CA", R: "elem", A: "@push$"},
					{S: "#CS", B: 1, A: "@push$"},
				},
			},
		},
	}

	j := tabnas.Make()
	if err := j.Grammar(spec); err != nil {
		panic(err)
	}

	for _, src := range []string{"42", `"hi"`, "{a:1}", "{a:1,b:2}", "{}", "[]"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		b, _ := json.Marshal(out)
		fmt.Printf("%-9s => %s\n", src, string(b))
	}
}
