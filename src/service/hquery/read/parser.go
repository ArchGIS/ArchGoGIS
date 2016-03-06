package read

import (
	"cfg"
	"io"
	"service/hquery/errs"
	"service/hquery/parsing"
	"service/hquery/read/ast"
	"strings"
	"throw"
)

func MustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	for tag, query := range this.input {
		throw.If(len(query) > 2, errs.QueryBadFormat)
		throw.If(len(tag) > cfg.HqueryMaxTagLen, errs.TagTooLong)
	}

	this.nodes = make(map[string]*ast.Node, len(this.input))
	this.edges = make([]*ast.Edge, 0, len(this.input))

	return this
}

func (my *Parser) mustParse() {
	for tag, query := range my.input {
		my.mustParseOne(tag, query)
	}

	for _, edge := range my.edges {
		if !(my.hasRef(edge.Lhs) && my.hasRef(edge.Rhs)) {
			throw.Error(errs.EdgeMissingRef)
		}
	}
}

func (my *Parser) mustParseOne(tag string, query map[string]string) {
	if strings.Contains(tag, "_") {
		my.mustParseEdge(tag, query)
	} else {
		my.mustParseNode(tag, query)
	}
}

func (my *Parser) mustParseNode(tag string, query map[string]string) {
	node := ast.MustNewNode(tag, query)
	my.nodes[node.Name] = node
}

func (my *Parser) mustParseEdge(tag string, query map[string]string) {
	edge := ast.MustNewEdge(tag, query)
	my.edges = append(my.edges, edge)
}

func (my *Parser) hasRef(key string) bool {
	_, has := my.nodes[key]
	return has
}
