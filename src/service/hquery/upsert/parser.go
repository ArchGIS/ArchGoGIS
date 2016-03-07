package upsert

import (
	"cfg"
	"io"
	"service/hquery/errs"
	"service/hquery/parsing"
	"service/hquery/upsert/ast"
	"strings"
	"throw"
)

func MustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	totalProps := 0
	for tag, rawProps := range this.input {
		totalProps += len(rawProps)

		throw.If(totalProps > cfg.HqueryMaxPropsTotal, errs.BatchTooManyProps)
		throw.If(len(rawProps) > cfg.HqueryMaxPropsPerEntry, errs.EntryTooManyProps)
		throw.If(len(tag) > cfg.HqueryMaxTagLen, errs.TagTooLong)
	}

	this.nodeInserts = make(map[string]*ast.Node, len(this.input))
	this.nodeUpdates = make(map[string]*ast.Node, len(this.input))
	this.edges = make([]*ast.Edge, 0, len(this.input))

	return this
}

func (my *Parser) mustParse() {
	for tag, rawProps := range my.input {
		my.mustParseOne(tag, rawProps)
	}

	for _, edge := range my.edges {
		if !(my.hasRef(edge.Lhs) && my.hasRef(edge.Rhs)) {
			throw.Error(errs.EdgeMissingRef)
		}
	}
}

func (my *Parser) mustParseOne(tag string, rawProps map[string]string) {
	if strings.Contains(tag, "_") {
		my.mustParseEdge(tag, rawProps)
	} else {
		my.mustParseNode(tag, rawProps)
	}
}

func (my *Parser) mustParseNode(tag string, rawProps map[string]string) {
	node := ast.MustNewNode(tag, rawProps)

	if _, hasId := rawProps["id"]; hasId {
		my.nodeUpdates[node.Name] = node
	} else {
		my.nodeInserts[node.Name] = node
	}
}

func (my *Parser) mustParseEdge(tag string, rawProps map[string]string) {
	my.edges = append(my.edges, ast.MustNewEdge(tag, rawProps))
}

func (my *Parser) hasRef(key string) bool {
	if _, hasRefInInserts := my.nodeInserts[key]; hasRefInInserts {
		return true
	}

	if _, hasRefInUpdates := my.nodeUpdates[key]; hasRefInUpdates {
		return true
	}

	return false
}
