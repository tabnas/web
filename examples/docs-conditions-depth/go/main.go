package main

import (
	"encoding/json"
	"errors"
	"fmt"

	tabnasjson "github.com/tabnas/json/go"
	tabnas "github.com/tabnas/parser/go"
)

const MAX = 3

func main() {
	j := tabnas.Make()
	if err := j.Use(tabnasjson.Json); err != nil {
		panic(err)
	}
	j.SetOptions(tabnas.MapToOptions(map[string]any{
		"error": map[string]any{"too_deep": "nested deeper than {max} levels"},
	}))
	OB, OS := j.Token("#OB"), j.Token("#OS")

	// Nesting is allowed while `depth` is below the limit. Past it neither push
	// alternate matches, and the unconditional guard behind them is reached.
	j.Rule("val", func(rs *tabnas.RuleSpec, p *tabnas.Parser) {
		guard := &tabnas.AltSpec{
			S: [][]tabnas.Tin{{OB, OS}},
			B: 1,
			E: func(r *tabnas.Rule, ctx *tabnas.Context) *tabnas.Token {
				return r.O0.Bad("too_deep", map[string]any{"max": MAX})
			},
		}
		rs.ModifyOpen(&tabnas.AltModListOpts{
			Custom: func(alts []*tabnas.AltSpec) []*tabnas.AltSpec {
				for _, alt := range alts[:2] { // the map and list push alternates
					alt.N = map[string]int{"depth": 1}
					alt.CD = map[string]any{"n.depth": tabnas.CLt(MAX)}
					if err := tabnas.NormAlt(alt); err != nil {
						panic(err)
					}
				}
				// The guard sits BEHIND them: alternates are tried in order, so
				// putting it first would claim the token every time.
				return append(alts[:2:2], append([]*tabnas.AltSpec{guard}, alts[2:]...)...)
			},
		})
	})

	for _, src := range []string{
		`{"a":1}`, `{"a":{"b":{"c":1}}}`, `[[[1]]]`,
		`{"a":{"b":{"c":{"d":1}}}}`, `[[[[1]]]]`,
	} {
		out, err := j.Parse(src)
		if err != nil {
			var te *tabnas.TabnasError
			errors.As(err, &te)
			fmt.Printf("%-26s => %s\n", src, te.Code)
			continue
		}
		b, _ := json.Marshal(out)
		fmt.Printf("%-26s => %s\n", src, string(b))
	}
}
