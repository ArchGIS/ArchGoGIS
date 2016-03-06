package ast

import (
	"service/hquery/fetch"
)

// x_Type_y
func NewEdge(tag string, rawProps map[string]string) (*Edge, error) {
	lhs, ty, rhs, err := fetch.DestructureEdgeTag(tag)
	if err != nil {
		return nil, err
	}

	props, err := newProps(rawProps)
	if err != nil {
		return nil, err
	}

	return &Edge{tag, lhs, rhs, ty, props}, nil
}
