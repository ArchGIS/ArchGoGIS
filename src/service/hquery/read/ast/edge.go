package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"strings"
)

func NewEdge(tag string, slots []string) (*Edge, error) {
	parts := strings.Split(tag, "_")
	if len(parts) != 3 {
		return nil, errs.TagBadFormat
	}

	lhs, ty, rhs := parts[0], parts[1], parts[2]

	if !valid.Identifier(lhs) || !valid.Identifier(rhs) || !valid.Identifier(ty) {
		return nil, errs.InvalidIdentifier
	}

	if len(slots) != 1 {
		return nil, errs.EdgeSlotsBadFormat
	}

	switch slots[0] {
	case "+":
		return &Edge{tag, lhs, rhs, ty, true}, nil
	case "-":
		return &Edge{tag, lhs, rhs, ty, false}, nil
	default:
		return nil, errs.SlotsBadSelector
	}
}

func fetchLhsAndRhs(name string) (string, string) {
	lhsAndRhs := strings.Split(name, "->")

	return lhsAndRhs[0], lhsAndRhs[1]
}
