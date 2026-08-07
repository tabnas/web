package main

import (
	"fmt"
	"sort"
	"strings"

	jsonic "github.com/tabnas/jsonic/go"
)

func main() {
	// Before changing a grammar, look at it. `RSM()` lists the rules on an
	// instance — possible because the grammar is still data at runtime rather
	// than generated code.
	rules := []string{}
	for name := range jsonic.Make().RSM() {
		rules = append(rules, name)
	}
	sort.Strings(rules)

	fmt.Println(strings.Join(rules, " "))
	fmt.Println("rule count:", len(rules))
}
