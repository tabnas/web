package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

// Config for a builtin rides on the alternate's `K`, keyed by the builtin name.
// `from` is which open token to read (default 0), `slot` is the `r.U` key to
// store under (default "key").
func build(keyConfig map[string]any) *tabnas.Tabnas {
	j := tabnas.Make()
	err := j.Grammar(&tabnas.GrammarSpec{
		OptionsMap: map[string]any{
			"fixed": map[string]any{"token": map[string]any{"#EQ": "="}},
			"rule":  map[string]any{"start": "pair"},
		},
		Rule: map[string]*tabnas.GrammarRuleSpec{
			"pair": {
				Open: []*tabnas.GrammarAltSpec{{
					S: []string{"#TX", "#EQ"},
					P: "val",
					A: []any{"@object$", "@key$"},
					K: keyConfig,
				}},
				Close: []*tabnas.GrammarAltSpec{{A: "@setval$"}},
			},
			"val": {
				Open:  []*tabnas.GrammarAltSpec{{S: "#NR", A: "@value$"}},
				Close: []*tabnas.GrammarAltSpec{{}},
			},
		},
	})
	if err != nil {
		panic(err)
	}
	return j
}

func render(j *tabnas.Tabnas) string {
	out, err := j.Parse("port = 8080")
	if err != nil {
		panic(err)
	}
	b, _ := json.Marshal(out)
	return string(b)
}

func main() {
	// Spelling the defaults out changes nothing — which is why a grammar that
	// relies on them never mentions them.
	fmt.Println("config omitted:  ", render(build(nil)))
	fmt.Println("defaults spelled:", render(build(map[string]any{
		"key$": map[string]any{"from": 0, "slot": "key"},
	})))
}
