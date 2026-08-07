package main

import (
	"fmt"
	"sort"
	"strings"

	jsonic "github.com/tabnas/jsonic/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	// A nil rule entry prunes that rule. This is how a stricter dialect is built
	// from a looser one.
	strict := jsonic.Make()
	err := strict.Grammar(&tabnas.GrammarSpec{
		Rule: map[string]*tabnas.GrammarRuleSpec{"list": nil},
	})
	if err != nil {
		panic(err)
	}

	rules := []string{}
	for name := range strict.RSM() {
		rules = append(rules, name)
	}
	sort.Strings(rules)
	fmt.Println("rules left:", strings.Join(rules, " "))

	for _, src := range []string{"{a:1}", "[1,2]"} {
		verdict := "accepted"
		if _, err := strict.Parse(src); err != nil {
			verdict = "rejected"
		}
		fmt.Printf("%-7s %s\n", src, verdict)
	}
}
