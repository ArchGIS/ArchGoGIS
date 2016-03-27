package parser

import (
	"fmt"
)

func (my *projection) add(stmt *Statement) {
	*my = append(*my, fmt.Sprintf("COLLECT(%s) AS %s", stmt.id, stmt.id))
}

func (my *projection) addUnique(stmt *Statement) {
	*my = append(*my, stmt.id)
}

func (my *projection) addMerge(lhs, rhs *Statement, rel *Relation) {
	relId := lhs.id + "_" + rhs.id

	if rel.unique {
		*my = append(*my, relId)
		my.addUnique(lhs)
	} else {
		*my = append(*my, fmt.Sprintf("COLLECT(%s) AS %s", relId, relId))
		my.add(lhs)
	}
}
