package ast

import (
	"service/hquery/errs"
	"strings"
)

func NewNode(tag string, rawProps map[string]string) (*Node, error) {
	labelSepPos := strings.IndexByte(tag, ':')
	if labelSepPos == -1 {
		return nil, errs.TagLabelMissing
	}

	name, labels := tag[:labelSepPos], tag[labelSepPos+1:]

	if !isIdentifier(name) {
		return nil, errs.InvalidIdentifier
	}

	props, err := newProps(rawProps)
	if err != nil {
		return nil, err
	}

	return &Node{tag, name, labels, props}, nil
}
