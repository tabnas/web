package main

import (
	"fmt"

	tabnasexpr "github.com/tabnas/expr/go"
	jsonic "github.com/tabnas/jsonic/go"
)

// `expr` did the parsing, so evaluation is a short recursive walk.
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
		return num(n) // a plain value
	}
	op := terms[0].(string)
	if "(" == op {
		return evaluate(terms[1]) // ( … ) — a single term
	}
	return OPS[op](evaluate(terms[1]), evaluate(terms[2]))
}

func main() {
	cfg := jsonic.Make()
	if err := cfg.Use(tabnasexpr.Expr); err != nil {
		panic(err)
	}

	for _, src := range []string{"v: 1+2*3", "v: (1+2)*3", "v: 10/4", "v: 7-1-2"} {
		out, err := cfg.Parse(src)
		if err != nil {
			panic(err)
		}
		conf := tabnasexpr.Simplify(out).(map[string]any)
		fmt.Printf("%-12s => %v\n", src, evaluate(conf["v"]))
	}
}
