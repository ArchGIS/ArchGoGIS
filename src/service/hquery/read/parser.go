package read

import (
	"cfg"
	"echo"
	"encoding/json"
	"io"
	"service/hquery/errs"
	"service/hquery/read/ast"
	"strings"
	"throw"
)

func MustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{}
	throw.Catch(json.NewDecoder(input).Decode(&this.input), func(err error) {
		echo.ClientError.Print(err)
		throw.Error(errs.BadJsonGiven)
	})

	throw.If(len(this.input) > cfg.HqueryMaxEntries, errs.TooManyEntries)
	throw.If(len(this.input) == 0, errs.EmptyInput)

	totalSlots := 0
	for tag, query := range this.input {
		totalSlots += len(query)

		throw.If(totalSlots > cfg.HqueryMaxPropsTotal, errs.BatchTooManyProps)
		throw.If(len(query) > cfg.HqueryMaxPropsPerEntry, errs.TagTooLong)
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
	node, err := ast.NewNode(tag, query)
	throw.OnError(err)

	my.nodes[node.Name] = node
}

func (my *Parser) mustParseEdge(tag string, query map[string]string) {
	edge, err := ast.NewEdge(tag, query)
	throw.OnError(err)

	my.edges = append(my.edges, edge)
}

func (my *Parser) hasRef(key string) bool {
	_, has := my.nodes[key]
	return has
}
