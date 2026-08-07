package main

import (
	"encoding/json"
	"fmt"

	jsonic "github.com/tabnas/jsonic/go"
)

func show(v any, err error) string {
	if err != nil {
		panic(err)
	}
	b, _ := json.Marshal(v)
	return string(b)
}

func main() {
	// `Make()` produces a fresh instance. Changes to it leave the shared
	// package-level parser alone, so other code using it is unaffected.
	mine := jsonic.Make()

	fmt.Println("derived  ", show(mine.Parse("a:1")))   // the derived instance
	fmt.Println("original ", show(jsonic.Parse("a:1"))) // still the original
}
