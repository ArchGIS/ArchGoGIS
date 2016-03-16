package read

import (
	"service/hquery/parsing"
	"service/hquery/read/ast"
)

type Data struct {
	nodes map[string]*ast.Node
	edges []*ast.Edge
}

type Parser struct {
	input parsing.Source
	limit string
	Data
}
