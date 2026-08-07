package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

// Not one function in it, so it survives a trip through JSON.
const SPEC = `{
  "options": { "rule": { "start": "val" } },
  "rule": {
    "val": {
      "open":  [ { "s": "#NR", "a": "@value$" } ],
      "close": [ {} ]
    }
  }
}`

func main() {
	// Go has no built-in JSON.parse, so hand the engine one to read text with.
	tabnas.RegisterTextParser(func(src string) (any, error) {
		var out any
		err := json.Unmarshal([]byte(src), &out)
		return out, err
	})

	j := tabnas.Make()
	if err := j.GrammarText(SPEC); err != nil {
		panic(err)
	}
	out, err := j.Parse("42")
	if err != nil {
		panic(err)
	}
	fmt.Println("original  42 =>", out)

	// Somewhere else entirely — a second process, a config store, a network hop.
	elsewhere := tabnas.Make()
	if err := elsewhere.GrammarText(SPEC); err != nil {
		panic(err)
	}
	out, err = elsewhere.Parse("42")
	if err != nil {
		panic(err)
	}
	fmt.Println("via JSON  42 =>", out)
}
