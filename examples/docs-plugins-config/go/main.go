package main

import (
	"fmt"

	tabnasexpr "github.com/tabnas/expr/go"
	jsonic "github.com/tabnas/jsonic/go"
)

var OPS = map[string]func(a, b float64) float64{
	"+": func(a, b float64) float64 { return a + b },
	"-": func(a, b float64) float64 { return a - b },
	"*": func(a, b float64) float64 { return a * b },
	"/": func(a, b float64) float64 { return a / b },
}

func num(v any) float64 {
	switch n := v.(type) {
	case int:
		return float64(n)
	case float64:
		return n
	}
	panic(fmt.Sprintf("not a number: %#v", v))
}

func evaluate(n any) float64 {
	terms, isExpr := n.([]any)
	if !isExpr {
		return num(n)
	}
	op := terms[0].(string)
	if "(" == op {
		return evaluate(terms[1])
	}
	return OPS[op](evaluate(terms[1]), evaluate(terms[2]))
}

func main() {
	cfg := jsonic.Make()
	if err := cfg.Use(tabnasexpr.Expr); err != nil {
		panic(err)
	}

	// And that's the language: a config format that takes arithmetic in its
	// values.
	out, err := cfg.Parse("width: 2+3*4, height: (2+3)*4, ratio: 10/4")
	if err != nil {
		panic(err)
	}
	conf := tabnasexpr.Simplify(out).(map[string]any)

	for _, key := range []string{"width", "height", "ratio"} {
		fmt.Printf("%-7s %v\n", key, evaluate(conf[key]))
	}
}
