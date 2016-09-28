package ast

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
)

func MustNewEdge(tag string, rawProps map[string]string) *Edge {
	lhs, ty, rhs := parsing.MustDestructureEdgeTag(tag)

	return &Edge{tag, lhs, rhs, ty, mustNewProps(rawProps)}
}
