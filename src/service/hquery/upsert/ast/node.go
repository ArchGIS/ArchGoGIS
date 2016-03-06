package ast

import (
	"service/hquery/errs"
	"service/hquery/parsing"
	"throw"
)

func MustNewNode(tag string, rawProps map[string]string) *Node {
	throw.If(len(rawProps) == 0, errs.NodeNoProps)

	name, labels := parsing.MustDestructureNodeTag(tag)

	return &Node{tag, name, labels, mustNewProps(rawProps)}
}
