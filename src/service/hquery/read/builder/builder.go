package builder

import (
	"db/neo"
	"ext"
	"service/hquery/placeholder"
	"service/hquery/read/ast"
	"strings"
)

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	nodes       map[string]*ast.Node
	edges       []*ast.Edge
	params      map[string]string
}

func NewStatementBuilder(nodes map[string]*ast.Node, edges []*ast.Edge) *StatementBuilder {
	return &StatementBuilder{
		params: make(map[string]string),
		nodes:  nodes,
		edges:  edges,
	}
}

func (my *StatementBuilder) Build(limit string) neo.Statement {
	selection := make([]string, 0, len(my.nodes))

	for _, node := range my.nodes {
		switch matcher := node.Props["id"]; matcher {
		case "*", "?":
			my.buf.WriteString("MATCH (" + node.Tag + ")")
		default:
			ph := my.placeholder.Next()
			my.buf.WriteStringf("MATCH (%s {id:{%s}})", node.Tag, ph)
			my.params[ph] = matcher
		}

		if _, selected := node.Props["select"]; selected {
			selection = append(selection, node.Name)
		}
	}

	for _, edge := range my.edges {
		my.buf.WriteStringf(
			"MATCH(%s)-[%s:%s]->(%s)",
			edge.Lhs, edge.Tag, edge.Type, edge.Rhs,
		)
	}

	my.buf.WriteStringf(
		"WITH %s LIMIT %s RETURN ",
		strings.Join(selection, ","),
		limit,
	)

	for _, node := range my.nodes {
		if _, selected := node.Props["select"]; selected {
			switch node.Props["id"] {
			case "?":
				my.buf.WriteString("(CASE WHEN LENGTH(COLLECT(" + node.Name + "))=1 ")
				my.buf.WriteString("THEN HEAD(COLLECT(" + node.Name + ")) ELSE NULL END) ")
				my.buf.WriteString("AS " + node.Name + ",")
			case "*":
				my.buf.WriteString("COLLECT(" + node.Name + ") AS " + node.Name + ",")
			default:
				my.buf.WriteString(node.Name + ",")
			}
		}
	}
	for _, edge := range my.edges {
		if _, selected := edge.Props["select"]; selected {
			my.buf.WriteString(edge.Tag + ",")
		}
	}
	my.buf.Truncate(my.buf.Len() - 1)

	return neo.Statement{
		my.buf.String(),
		my.params,
	}
}
