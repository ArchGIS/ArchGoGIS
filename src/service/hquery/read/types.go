package read

import (
	"service/hquery/read/ast"
)

type Data struct {
	nodes map[string]*ast.Node
	edges []*ast.Edge
}

type Parser struct {
	input map[string]map[string]string
	Data
}
