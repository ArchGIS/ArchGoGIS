package upsert

import (
	"service/hquery/parsing"
	"service/hquery/upsert/ast"
)

type Data struct {
	nodeInserts map[string]*ast.Node
	nodeUpdates map[string]*ast.Node
	edges       []*ast.Edge
}

type Parser struct {
	input parsing.Source
	Data
}
