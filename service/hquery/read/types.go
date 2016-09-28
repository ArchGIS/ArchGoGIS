package read

import (
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/placeholder"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read/ast"
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
