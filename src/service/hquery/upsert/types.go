package upsert

import (
	"service/hquery/upsert/ast"
)

type Parser struct {
	nodeInserts map[string]*ast.Node
	nodeUpdates map[string]*ast.Node
	edgeInserts []*ast.Edge
	edgeUpdates []*ast.Edge
	input       map[string]map[string]string
}
