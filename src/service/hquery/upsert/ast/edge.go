package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"strings"
)

// x_Type_y
func NewEdge(tag string, rawProps map[string]string) (*Edge, error) {
	parts := strings.Split(tag, "_")
	if len(parts) != 3 {
		return nil, errs.TagBadFormat
	}

	lhs, ty, rhs := parts[0], parts[1], parts[2]

	if !valid.Identifier(lhs) || !valid.Identifier(rhs) || !valid.Identifier(ty) {
		return nil, errs.InvalidIdentifier
	}

	props, err := newProps(rawProps)
	if err != nil {
		return nil, err
	}

	return &Edge{lhs, rhs, ty, props}, nil
}
