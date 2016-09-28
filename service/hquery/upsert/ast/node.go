package ast

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	"github.com/ArchGIS/ArchGoGIS/throw"
)

func MustNewNode(tag string, rawProps map[string]string) *Node {
	throw.If(len(rawProps) == 0, errs.NodeNoProps)

	name, labels := parsing.MustDestructureNodeTag(tag)

	return &Node{tag, name, labels, mustNewProps(rawProps)}
}
