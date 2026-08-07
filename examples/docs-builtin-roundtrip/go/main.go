package main

import (
	"encoding/json"
	"fmt"

	tabnas "github.com/tabnas/parser/go"
)

// The same grammar, kept as text — the form it would live in on disk or on the
// wire.
const WIRE = `{
  "options": {
    "fixed": { "token": { "#EQ": "=" } },
    "rule":  { "start": "pair" }
  },
  "rule": {
    "pair": {
      "open":  [ { "s": "#TX #EQ", "p": "val", "a": ["@object$", "@key$"] } ],
      "close": [ { "a": "@setval$" } ]
    },
    "val": {
      "open":  [ { "s": "#NR", "a": "@value$" } ],
      "close": [ {} ]
    }
  }
}`

func parse(text string) string {
	j := tabnas.Make()
	if err := j.GrammarText(text); err != nil {
		panic(err)
	}
	out, err := j.Parse("port = 8080")
	if err != nil {
		panic(err)
	}
	b, _ := json.Marshal(out)
	return string(b)
}

func main() {
	// Go has no built-in JSON.parse, so hand the engine one to read text with.
	tabnas.RegisterTextParser(func(src string) (any, error) {
		var out any
		err := json.Unmarshal([]byte(src), &out)
		return out, err
	})

	fmt.Println("here      =>", parse(WIRE))

	// Later, or elsewhere, or in another process — the same text, nothing else.
	fmt.Println("elsewhere =>", parse(WIRE))
}
