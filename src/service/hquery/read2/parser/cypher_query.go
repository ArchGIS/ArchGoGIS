package parser

import (
	"bytes"
	"fmt"
	"strings"
)

func (my *cypherQuery) build() []byte {
	var query bytes.Buffer

	// Порядок имеет значение. Сначала matches, затем уже optional matches.
	query.WriteString(strings.Join(my.exactMatches, ""))
	query.WriteString(strings.Join(my.optionalMatches, ""))
	query.WriteString("RETURN " + strings.Join(my.projection, ","))

	return query.Bytes()
}

func (my *cypherQuery) addMatch(lhs, rhs *Statement, rel *Relation) {
	if rel.optional {
		match := fmt.Sprintf(rel.pat, lhs.id, rel.name, rhs.id, rel.renaming)
		my.optionalMatches = append(my.optionalMatches, match)
	} else {
		match := fmt.Sprintf(rel.pat, lhs.id, rel.name, rhs.id, rel.renaming)
		my.exactMatches = append(my.exactMatches, match)
	}
}

/*
func (my *cypherQuery) addProjection(lhs *Statement, rel *Relation) {
	if rel.unique {
		my.projection = append(my.projection, lhs.id)
	} else {
		proj := fmt.Sprintf("COLLECT(%[1]s) AS %[1]s", lhs.id)
		my.projection = append(my.projection, proj)
	}
}
*/

func (my *cypherQuery) addProjection(projection string) {
	my.projection = append(my.projection, projection)
}

func (my *cypherQuery) addMultiProjection(stmt *Statement) {
	my.addProjection(fmt.Sprintf("COLLECT(%[1]s) AS %[1]s", stmt.id))
}

func (my *cypherQuery) addStatement(stmt *Statement) {
	match := fmt.Sprintf("MATCH (%s:%s {id:%d})", stmt.id, stmt.class, stmt.idParam())
	my.exactMatches = append(my.exactMatches, match)

	my.projection = append(my.projection, stmt.id)
}

func (my *cypherQuery) addMerge(lhs, rhs *Statement, rel *Relation) {
	relId := lhs.id + "_" + rhs.id

	if rel.unique {
		my.projection = append(my.projection, relId)
		my.projection = append(my.projection, rhs.id)
	} else {
		my.projection = append(my.projection, fmt.Sprintf("COLLECT(%[1]s) AS %[1]s", relId))
		my.projection = append(my.projection, fmt.Sprintf("COLLECT(%[1]s) AS %[1]s", rhs.id))
	}

	my.addMatch(lhs, rhs, rel)
}
