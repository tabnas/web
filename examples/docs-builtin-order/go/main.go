package main

import (
	"encoding/json"
	"fmt"
	"strings"

	tabnas "github.com/tabnas/parser/go"
)

// `A` takes a list, run in order. `["@reset$", "@object$"]` is the idiom for a
// rule that must not inherit its parent's node: clear first, then build.
func build(actions []any) *tabnas.Tabnas {
	j := tabnas.Make()
	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{"rule": map[string]any{"start": "val"}},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"val": {
				Open: []*tabnas.GrammarAltSpec{
					{S: "#OB", P: "map", B: 1, A: actions},
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
		},
	})
	if err != nil {
		panic(err)
	}
	return j
}

func main() {
	// Order matters: reset after building throws the object away again.
	for _, actions := range [][]any{{"@reset$", "@object$"}, {"@object$", "@reset$"}} {
		out, err := build(actions).Parse("{a:1}")
		if err != nil {
			panic(err)
		}
		names := []string{}
		for _, a := range actions {
			names = append(names, a.(string))
		}
		shown := "(no value)"
		if nil != out && !tabnas.IsUndefined(out) {
			b, _ := json.Marshal(out)
			shown = string(b)
		}
		fmt.Println(strings.Join(names, ","), "=>", shown)
	}
}
