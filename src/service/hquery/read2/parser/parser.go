package parser

import (
	"bytes"
	"strings"
)

func New(query map[string]interface{}) *Parser {
	statements := make(map[string]*Statement, len(query))
	for tag, params := range query {
		statement := NewStatement(tag, params)
		statements[statement.id] = statement
	}

	return &Parser{
		statements,
		newMatches(len(query)),
		make([]string, 0, len(query)),
		newMergeData(),
	}
}

func (my *Parser) GenerateCypher() []byte {
	my.mustParseAll()

	var cypher bytes.Buffer

	// Порядок имеет значение. Сначала matches, затем уже optional matches.
	cypher.WriteString(strings.Join(my.matches.Exact, ""))
	for _, optionalMatch := range my.matches.Optional {
		cypher.WriteString("OPTIONAL " + optionalMatch)
	}
	cypher.WriteString("RETURN " + strings.Join(my.projection, ","))

	return cypher.Bytes()
}

func (my *Parser) mustParseAll() {
	for _, statement := range my.statements {
		switch statement.method {
		case "getBy":
			my.parseGetBy(statement)
		case "mergeBy":
			my.parseMergeBy(statement)
		default:
			panic("unknown method")
		}
	}
}

func (my *Parser) matchByLeftMerge(lhs, rhs *Statement, rel Relation) {
	merge := lhs.id + "_" + rhs.id

	my.MergeData.add(merge, rhs.id)

	my.projection = append(my.projection, "COLLECT("+merge+") AS "+merge)
	my.projection.add(rhs)
	// my.projection.addMerge(rhs, lhs, &rel)

	my.matches.addLeft(lhs, rhs, &rel)
}

func (my *Parser) matchByRightMerge(lhs, rhs *Statement, rel Relation) {
	merge := lhs.id + "_" + rhs.id

	my.MergeData.add(merge, lhs.id)

	// my.projection.addMerge(lhs, rhs, &rel)
	my.projection = append(my.projection, "COLLECT("+merge+") AS "+merge)
	my.projection.add(lhs)

	my.matches.addRight(lhs, rhs, &rel)
}

func (my *Parser) matchGetBy(this *Statement) {
	that := my.statements[this.params.(string)]

	if _, isRight := getRelations[this.class][that.class]; isRight {
		// mustNewSegment(this, that, getRelations[this.class][that.class])
		my.matchByRightStatement(this, that, getRelations[this.class][that.class])
	} else if _, isLeft := getRelations[that.class][this.class]; isLeft {
		my.matchByLeftStatement(that, this, getRelations[that.class][this.class])
	} else {
		panic("invalid relation")
	}
}

func (my *Parser) matchMergeBy(this *Statement) {
	that := my.statements[this.params.(string)]

	if _, isRight := mergeRelations[this.class][that.class]; isRight {
		// mustNewSegment(this, that, getRelations[this.class][that.class])
		my.matchByRightMerge(this, that, mergeRelations[this.class][that.class])
	} else if _, isLeft := mergeRelations[that.class][this.class]; isLeft {
		my.matchByLeftMerge(that, this, mergeRelations[that.class][this.class])
	} else {
		panic("invalid relation")
	}
}

func (my *Parser) parseMergeBy(statement *Statement) {
	if _, isString := statement.params.(string); isString {
		my.matchMergeBy(statement)
	} else {
		panic("not a valid merge by param")
	}
}

func (my *Parser) parseGetBy(statement *Statement) {
	switch statement.params.(type) {
	case float64:
		my.matchGetById(statement)
	case string:
		my.matchGetBy(statement)

	default:
		panic("unknown type in params")
	}
}

func (my *Parser) allParentRelationsAreUnique(statement *Statement) bool {
	parent := my.statements[statement.params.(string)]

	parentRelation := getRelations[parent.class][statement.class]

	if parentRelation.unique {
		return my.allParentRelationsAreUnique(parent)
	} else {
		return false
	}
}

func (my *Parser) parseRelationProjection(lhs, rhs *Statement, rel *Relation) {
	if rel.unique {
		if _, hasParent := lhs.params.(string); hasParent {
			if my.allParentRelationsAreUnique(lhs) {
				my.projection.addUnique(rhs)
			} else {
				my.projection.add(rhs)
			}
		} else {
			my.projection.addUnique(rhs)
		}
	} else {
		my.projection.add(rhs)
	}
}

func (my *Parser) matchByLeftStatement(lhs, rhs *Statement, rel Relation) {
	my.parseRelationProjection(lhs, rhs, &rel)
	my.matches.addLeft(lhs, rhs, &rel)
}

func (my *Parser) matchByRightStatement(lhs, rhs *Statement, rel Relation) {
	my.parseRelationProjection(rhs, lhs, &rel)
	my.matches.addRight(lhs, rhs, &rel)
}

func (my *Parser) matchGetById(statement *Statement) {
	my.projection.addUnique(statement)
	my.matches.add(statement)
}
