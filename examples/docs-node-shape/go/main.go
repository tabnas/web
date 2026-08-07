package main

import "fmt"

// The shape every tree-building grammar produces.
type Node struct {
	Rule string `json:"rule"`
	Src  string `json:"src"`
	Kids []Node `json:"kids"`
}

func main() {
	node := Node{
		Rule: "val",
		Src:  "1+2",
		Kids: []Node{
			{Rule: "add", Src: "1", Kids: []Node{}},
			{Rule: "add", Src: "2", Kids: []Node{}},
		},
	}

	fmt.Println(node.Rule, len(node.Kids))
}
