package read

import (
	"strings"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read/ast"
)

func NewStatementBuilder(data *Data) *StatementBuilder {
	return &StatementBuilder{
		params: make(map[string]string),
		Data:   data,
	}
}

func nodeMatchFmt(optional bool) string {
	if optional {
		return "OPTIONAL MATCH (%s)"
	} else {
		return "MATCH (%s)"
	}
}

func (my *StatementBuilder) scanNodes(optional bool, nodes map[string]*ast.Node) []string {
	selection := make([]string, 0, len(nodes))

	for _, node := range nodes {
		switch matcher := node.Props["id"]; matcher {
		case "*", "?":
			my.buf.WriteStringf(nodeMatchFmt(optional), node.Tag)
		default:
			ph := my.placeholder.Next()
			my.buf.WriteStringf("MATCH (%s {id:{%s}})", node.Tag, ph)
			my.params[ph] = matcher
		}

		if _, selected := node.Props["select"]; selected {
			selection = append(selection, node.Name)
		}
	}

	return selection
}

func (my *StatementBuilder) scanReturn(nodes map[string]*ast.Node, edges []*ast.Edge) {
	for _, node := range nodes {
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
	for _, edge := range edges {
		if _, selected := edge.Props["select"]; selected {
			if edge.Props["collect"] != "" { // Временный хак
				my.buf.WriteStringf("COLLECT(%s) AS %s,", edge.Tag, edge.Tag)
			} else {
				my.buf.WriteString(edge.Tag + ",")
			}
		}
	}
}

func (my *StatementBuilder) Build(limit string) neo.Statement {
	selection := my.scanNodes(false, my.nodes)

	if len(my.edges) != 0 {
		my.buf.WriteStringf("WHERE ")
	}

	for i, edge := range my.edges {
		if edge.Props["select"] != "" {
			selection = append(selection, edge.Tag)
		}

		my.buf.WriteStringf(
			"(%s)-[:%s]->(%s)",
			edge.Lhs, edge.Type, edge.Rhs,
		)

		if i != len(my.edges)-1 {
			my.buf.WriteStringf("AND ")
		}
	}

	if len(my.optionalEdges) != 0 {
		my.buf.WriteStringf("WHERE ")
	}

	optionalSelection := my.scanNodes(true, my.optionalNodes)
	for i, edge := range my.optionalEdges {
		if edge.Props["select"] != "" {
			optionalSelection = append(optionalSelection, edge.Tag)
		}

		my.buf.WriteStringf(
			"(%s)-[:%s]->(%s)",
			edge.Lhs, edge.Type, edge.Rhs,
		)

		if i != len(my.optionalEdges)-1 {
			my.buf.WriteStringf("AND ")
		}
	}

	my.buf.WriteStringf(
		"WITH %s LIMIT %s RETURN ",
		strings.Join(append(selection, optionalSelection...), ","),
		limit,
	)

	my.scanReturn(my.nodes, my.edges)
	my.scanReturn(my.optionalNodes, my.optionalEdges)
	my.buf.Truncate(my.buf.Len() - 1)

	return neo.Statement{
		my.buf.String(),
		my.params,
	}
}
