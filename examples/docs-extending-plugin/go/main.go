package main

import (
	"encoding/json"
	"fmt"

	tabnasexpr "github.com/tabnas/expr/go"
	jsonic "github.com/tabnas/jsonic/go"
)

func show(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func main() {
	// A plugin is a function that modifies a grammar — adding rules, adding
	// alternates to existing rules, registering tokens.
	cfg := jsonic.Make()
	if err := cfg.Use(tabnasexpr.Expr); err != nil {
		panic(err)
	}

	base, err := jsonic.Parse("x: 1+2*3")
	if err != nil {
		panic(err)
	}
	out, err := cfg.Parse("x: 1+2*3")
	if err != nil {
		panic(err)
	}

	fmt.Println("base  ", show(base))
	// Simplify abbreviates each op node to its source string.
	fmt.Println("+Expr ", show(tabnasexpr.Simplify(out)))
}
