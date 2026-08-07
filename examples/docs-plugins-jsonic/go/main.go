package main

import (
	"encoding/json"
	"fmt"

	jsonic "github.com/tabnas/jsonic/go"
)

func show(src string) string {
	out, err := jsonic.Parse(src)
	if err != nil {
		panic(err)
	}
	b, _ := json.Marshal(out)
	return string(b)
}

func main() {
	// jsonic is a relaxed JSON — unquoted keys, implicit objects, comments,
	// trailing commas. Already a usable config format.
	fmt.Println(show("a:1, b:{c:2}, d:[3,4]"))

	// What it doesn't do is arithmetic: a value like 1+2 is just a string.
	fmt.Println(show("x: 1+2"))
}
