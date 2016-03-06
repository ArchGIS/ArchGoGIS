package ast

import (
	"service/hquery/errs"
	"service/hquery/parsing"
	"throw"
)

func MustNewNode(tag string, query map[string]string) *Node {
	switch len(query) {
	case 1:
		mustValidateMatcher(query["id"])

	case 2:
		mustValidateMatcher(query["id"])
		mustValidateSelector(query["select"])

	default:
		throw.Error(errs.QueryBadFormat)
	}

	name, labels := parsing.MustDestructureNodeTag(tag)

	return &Node{tag, name, labels, query}
}
