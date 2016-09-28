package ast

import (
	// "service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	// "throw"
)

func MustNewEdge(tag string, query map[string]string) *Edge {
	if len(query) != 0 {
		mustValidateSelector(query["select"])

		/* Вернуть проверку после демонстрационного показа заказчику.
		if len(query) == 1 {
			mustValidateSelector(query["select"])
		} else {
			throw.Error(errs.QueryBadFormat)
		}*/
	}

	lhs, ty, rhs := parsing.MustDestructureEdgeTag(tag)

	return &Edge{tag, lhs, rhs, ty, query}
}
