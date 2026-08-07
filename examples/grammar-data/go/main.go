package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

// The same grammar as step 1, but as data — the shape an agent emits.
const GRAMMAR = `{
  "options": {
    "fixed": { "token": { "#PL": "+" } },
    "rule":  { "start": "val" }
  },
  "rule": {
    "val": {
      "open":  [ { "p": "add" } ],
      "close": [ {} ]
    },
    "add": {
      "open":  [ { "s": "#NR" } ],
      "close": [ { "s": "#PL", "r": "add" }, {} ]
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
	if err := j.GrammarText(GRAMMAR); err != nil {
		panic(err)
	}

	// It recognises an addition chain and refuses anything else — but, having
	// no actions, it produces nothing.
	for _, src := range []string{"1+2+3", "12+3+45", "1+*"} {
		state := "accepted"
		if _, err := j.Parse(src); err != nil {
			state = "rejected"
		}
		fmt.Printf("%-8s %s\n", src, state)
	}
}
