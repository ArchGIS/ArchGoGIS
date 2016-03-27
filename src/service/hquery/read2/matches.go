package read2

import (
	"fmt"
)

func newMatches(sizeHint int) matches {
	return matches{
		make([]string, 0, sizeHint),
		make([]string, 0, sizeHint),
	}
}

func (my *matches) add(statement *Statement) {
	matchById := fmt.Sprintf(
		"MATCH (%s:%s {id:%d})",
		statement.id,
		statement.class,
		int(statement.params.(float64)),
	)

	my.Exact = append(my.Exact, matchById)
}

func (my *matches) addLeft(lhs, rhs *Statement, rel *Relation) {
	if rel.optional {
		my.Optional = append(my.Optional, my.leftMatch(lhs, rhs, rel))
	} else {
		my.Exact = append(my.Exact, my.leftMatch(lhs, rhs, rel))
	}
}

func (my *matches) addRight(lhs, rhs *Statement, rel *Relation) {
	if rel.optional {
		my.Optional = append(my.Optional, my.rightMatch(lhs, rhs, rel))
	} else {
		my.Exact = append(my.Exact, my.rightMatch(lhs, rhs, rel))
	}
}

func (my *matches) leftMatch(lhs, rhs *Statement, rel *Relation) string {
	relId := lhs.id + "_" + rhs.id

	return fmt.Sprintf(
		"MATCH (%s)-[%s:%s]->(%s:%s)",
		lhs.id, relId, rel.name, rhs.id, classRenamings[rhs.class],
	)
}

func (my *matches) rightMatch(lhs, rhs *Statement, rel *Relation) string {
	relId := lhs.id + "_" + rhs.id

	return fmt.Sprintf(
		"MATCH (%s:%s)-[%s:%s]->(%s)",
		lhs.id, classRenamings[lhs.class], relId, rel.name, rhs.id,
	)
}
