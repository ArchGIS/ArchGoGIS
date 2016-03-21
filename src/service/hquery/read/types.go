package read

import (
	"ext"
	"service/hquery/parsing"
	"service/hquery/placeholder"
	"service/hquery/read/ast"
)

type Data struct {
	nodes         map[string]*ast.Node
	edges         []*ast.Edge
	optionalNodes map[string]*ast.Node
	optionalEdges []*ast.Edge
}

type Parser struct {
	input parsing.Tree
	limit string
	Data
}

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	params      map[string]string
	*Data
}
