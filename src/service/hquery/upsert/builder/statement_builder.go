package builder

import (
	"db/neo"
	"service/hquery/upsert/ast"
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

	props := make([]string, len(node.Props))
	for key, val := range node.Props {
		my.params[my.placeholder.Next()] = val
		props = append(props, key+":{"+my.placeholder.Current()+"}")
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
		insertProps := make([]string, len(edge.Props))
		updateProps := make([]string, len(edge.Props))
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
	my.buf.WriteStringf("MATCH (%s {id:{%s}})", node.Tag, my.placeholder.Next())
	my.params[my.placeholder.Current()] = id
}
