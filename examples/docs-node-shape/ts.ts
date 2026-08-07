// The shape every tree-building grammar produces.
type Node = { rule: string; src: string; kids: Node[] }

const node: Node = {
  rule: 'val',
  src: '1+2',
  kids: [
    { rule: 'add', src: '1', kids: [] },
    { rule: 'add', src: '2', kids: [] },
  ],
}

console.log(node.rule, node.kids.length)
