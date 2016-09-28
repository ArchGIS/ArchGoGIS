package builder

import (
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/upsert/ast"
	"strings"
)

func NewStatementBuilder(paramCount int) *StatementBuilder {
	return &StatementBuilder{params: make(map[string]string, paramCount)}
}

func (my *StatementBuilder) Build() neo.Statement {
	return neo.Statement{my.buf.String(), my.params}
}

func (my *StatementBuilder) AddNode(id string, node *ast.Node) {
	node.Props["id"] = id

	props := make([]string, 0, len(node.Props))
	for key, val := range node.Props {
		placeholder := my.placeholder.Next()
		my.params[placeholder] = val
		props = append(props, key+":{"+placeholder+"}")
	}

	my.buf.WriteStringf("CREATE (%s {%s})", node.Tag, strings.Join(props, ","))
}

func (my *StatementBuilder) AddEdge(edge *ast.Edge) {
	if 0 == len(edge.Props) {
		my.buf.WriteStringf(
			"CREATE UNIQUE(%s)-[%s:%s]->(%s)",
			edge.Lhs, edge.Tag, edge.Type, edge.Rhs,
		)
	} else {
		insertProps := make([]string, 0, len(edge.Props))
		updateProps := make([]string, 0, len(edge.Props))
		for key, val := range edge.Props {
			ph := my.placeholder.Next()
			insertProps = append(insertProps, key+":{"+ph+"}")
			updateProps = append(updateProps, edge.Tag+"."+key+"={"+ph+"}")
			my.params[ph] = val
		}

		my.buf.WriteStringf(
			"CREATE UNIQUE (%s)-[%s:%s {%s}]->(%s) SET %s",
			edge.Lhs, edge.Tag, edge.Type,
			strings.Join(insertProps, ","),
			edge.Rhs,
			strings.Join(updateProps, ","),
		)
	}
}

func (my *StatementBuilder) AddRef(id string, node *ast.Node) {
	placeholder := my.placeholder.Next()
	my.buf.WriteStringf("MATCH (%s {id:{%s}})", node.Tag, placeholder)
	my.params[placeholder] = id
}
