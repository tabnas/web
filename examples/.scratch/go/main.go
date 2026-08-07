package main

import (
	"fmt"

	abnf "github.com/tabnas/abnf/go"
	tabnas "github.com/tabnas/parser/go"
)

func main() {
	j := tabnas.Make()
	_, err := abnf.Install(j, `
  val = add
  add = NR [ PL add ]
  PL  = "+"
`, nil, nil)
	if err != nil {
		panic(err)
	}
	for _, src := range []string{"1+2+3", "1+*"} {
		out, err := j.Parse(src)
		if err != nil {
			fmt.Printf("%s ERR %q\n", src, err.Error())
			continue
		}
		fmt.Printf("%s ok %#v\n", src, out)
	}
}
