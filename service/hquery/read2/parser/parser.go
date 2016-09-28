package parser

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/throw"
)

func isString(maybeString interface{}) bool {
	_, ok := maybeString.(string)
	return ok
}

func New(query map[string]interface{}) *Parser {
	statements := make(map[string]*Statement, len(query))
	for tag, params := range query {
		statement := NewStatement(tag, params)
		statements[statement.id] = statement
	}

	return &Parser{
		statements,
		cypherQuery{},
		newMergeData(),
	}
}

func (my *Parser) GenerateCypher() []byte {
	my.mustParseAll()
	return my.query.build()
}

func (my *Parser) mustParseAll() {
	for _, statement := range my.statements {
		switch statement.method {
		case "getAll":
			my.parseGetAll(statement)
		case "getBy":
			my.parseGetBy(statement)
		case "mergeBy":
			my.parseMergeBy(statement)
		default:
			panic(errs.UnknownMethod)
		}
	}
}

func (my *Parser) parseGetAll(statement *Statement) {
	throw.If(!isString(statement.params), errs.InvalidGetAllParam)
	my.matchGetById(statement)
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

func (my *Parser) parseMergeBy(statement *Statement) {
	throw.If(!isString(statement.params), errs.InvalidMergeByParam)
	my.matchGetAll(statement)
}

func (my *Parser) matchGetAll(statement *Statement) {
	selector := statement.params.(string)
	if "*" == selector {
		my.matchGetById(statement)
	} else {
		throw.Error(errs.InvalidGetAllParam)
	}
}

func (my *Parser) matchGetBy(this *Statement) {
	that := my.statements[this.params.(string)]
	rel := getTree[that.class][this.class]

	if rel.unique {
		if that.hasParent() {
			thatParent := my.seekTopParent(that)
			if thatParent != that {
				thatParentRel := getTree[thatParent.class][that.class]
				if thatParentRel.unique {
					my.query.addProjection(this.id)
				} else {
					my.query.addMultiProjection(this)
				}
			}
		} else {
			my.query.addProjection(this.id)
		}
	} else {
		my.query.addMultiProjection(this)
	}

	my.query.addMatch(that, this, &rel)
}

func (my *Parser) matchMergeBy(this *Statement) {
	that := my.statements[this.params.(string)]
	rel := getTree[that.class][this.class]

	my.query.addMerge(that, this, &rel)
	my.MergeData.add(that, this)
}

func (my *Parser) seekTopParent(stmt *Statement) *Statement {
	if stmt.hasParent() {
		parent := my.statements[stmt.params.(string)]
		return my.seekTopParent(parent)
	} else {
		return stmt
	}
}

func (my *Parser) matchGetById(stmt *Statement) {
	my.query.addStatement(stmt)
}
