package ast

import (
	"service/hquery/errs"
	"strings"
)

func NewEdge(tag string, rawProps map[string]string) (*Edge, error) {
	firstColonPos := strings.IndexByte(tag, ':')
	if firstColonPos == -1 {
		return nil, errs.TagLabelMissing
	}
	lastColonPos := strings.LastIndexByte(tag, ':')
	if firstColonPos != lastColonPos {
		return nil, errs.EdgeTooManyLabels
	}

	name, label := tag[:firstColonPos], tag[firstColonPos+1:]

	lhs, rhs := fetchLhsAndRhs(name)
	if !isIdentifier(lhs) || !isIdentifier(rhs) {
		return nil, errs.InvalidIdentifier
	}

	props, err := newProps(rawProps)
	if err != nil {
		return nil, err
	}

	return &Edge{lhs, rhs, label, props}, nil
}

func fetchLhsAndRhs(name string) (string, string) {
	lhsAndRhs := strings.Split(name, "->")

	return lhsAndRhs[0], lhsAndRhs[1]
}
