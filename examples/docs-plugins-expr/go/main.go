package main

import (
	"encoding/json"
	"fmt"

	tabnasexpr "github.com/tabnas/expr/go"
	jsonic "github.com/tabnas/jsonic/go"
)

func main() {
	// `Make()` derives a fresh instance so the base parser is left alone, and
	// `Use()` layers a plugin onto it.
	cfg := jsonic.Make()
	if err := cfg.Use(tabnasexpr.Expr); err != nil {
		panic(err)
	}

	out, err := cfg.Parse("x: 1+2*3")
	if err != nil {
		panic(err)
	}

	// The first element of an expression is an operator node; `Simplify`
	// abbreviates each one to its source string.
	b, _ := json.Marshal(tabnasexpr.Simplify(out))

	// Precedence is already handled: 1+2*3 groups the multiplication first.
	fmt.Println(string(b))
}
