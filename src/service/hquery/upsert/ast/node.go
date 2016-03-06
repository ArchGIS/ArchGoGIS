package ast

import (
	"service/hquery/errs"
	"service/hquery/fetch"
)

func NewNode(tag string, rawProps map[string]string) (*Node, error) {
	if len(rawProps) == 0 {
		return nil, errs.NodeNoProps
	}

	name, labels, err := fetch.NameAndLabels(tag)
	if err != nil {
		return nil, err
	}

	props, err := newProps(rawProps)
	if err != nil {
		return nil, err
	}

	return &Node{tag, name, labels, props}, nil
}
