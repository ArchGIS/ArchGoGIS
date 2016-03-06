package ast

import (
	"service/hquery/fetch"
)

func NewNode(tag string, query map[string]string) (*Node, error) {
	if err := nodeQueryError(query); err != nil {
		return nil, err
	}

	name, labels, err := fetch.NameAndLabels(tag)
	if err != nil {
		return nil, err
	}

	return &Node{tag, name, labels, query}, nil
}
