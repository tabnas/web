package main

import (
	"encoding/json"
	"fmt"

	tabnasexpr "github.com/tabnas/expr/go"
	jsonic "github.com/tabnas/jsonic/go"
)

func main() {
	cfg := jsonic.Make()
	if err := cfg.Use(tabnasexpr.Expr); err != nil {
		panic(err)
	}

	out, err := cfg.Parse("y: (1+2)*3")
	if err != nil {
		panic(err)
	}

	// Parentheses work too, and are a node of their own with a single term — so
	// an evaluator can recognise them and just descend.
	b, _ := json.Marshal(tabnasexpr.Simplify(out))
	fmt.Println(string(b))
}
