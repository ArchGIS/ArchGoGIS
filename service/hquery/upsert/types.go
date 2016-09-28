package upsert

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/upsert/ast"
)

type Data struct {
	nodeInserts map[string]*ast.Node
	nodeUpdates map[string]*ast.Node
	edges       []*ast.Edge
}

type Parser struct {
	input parsing.Tree
	Data
}
