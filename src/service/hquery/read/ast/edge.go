package ast

import (
	"service/hquery/fetch"
)

func NewEdge(tag string, query map[string]string) (*Edge, error) {
	if err := edgeQueryError(query); err != nil {
		return nil, err
	}

	lhs, ty, rhs, err := fetch.DestructureEdgeTag(tag)
	if err != nil {
		return nil, err
	}

	return &Edge{tag, lhs, rhs, ty, query}, nil
}
