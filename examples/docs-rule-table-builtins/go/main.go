package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

// Actions referenced by name, so the whole grammar is JSON with no functions.
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

	for _, src := range []string{"42", "-7", "3.5"} {
		out, err := j.Parse(src)
		if err != nil {
			panic(err)
		}
		fmt.Printf("%-4s => %v\n", src, out)
	}
}
