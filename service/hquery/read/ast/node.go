package ast

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
)

func MustNewNode(tag string, query map[string]string) *Node {
	if (query["id"] != "") {
		mustValidateMatcher(query["id"])
	}

	if (query["select"] != "") {
		mustValidateSelector(query["select"])
	}


	name, labels := parsing.MustDestructureNodeTag(tag)

	return &Node{tag, name, labels, query}
}
