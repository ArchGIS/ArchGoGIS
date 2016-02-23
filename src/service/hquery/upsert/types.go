package upsert

import (
	"service/hquery/upsert/ast"
)

type Data struct {
	nodeInserts map[string]*ast.Node
	nodeUpdates map[string]*ast.Node
	edgeInserts []*ast.Edge
	edgeUpdates []*ast.Edge
}

type Parser struct {
	input map[string]map[string]string
	Data
}

type errorProxy struct {
	err error
}
