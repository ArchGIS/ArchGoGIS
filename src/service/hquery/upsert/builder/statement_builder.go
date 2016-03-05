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
	return neo.Statement{
		my.buf.String(),
		my.params,
	}
}

func (my *StatementBuilder) AddNode(id string, node *ast.Node) {
	node.Props["id"] = id

	my.buf.WriteString("CREATE (" + node.Tag + " {")
	my.writeProps(node.Props)
	my.buf.WriteString("})")
}

func (my *StatementBuilder) AddEdge(edge *ast.Edge) {
	name := edge.Lhs + "_" + edge.Type + "_" + edge.Rhs // Возможно стоит вынести в newEdge()

	if 0 == len(edge.Props) {
		my.buf.WriteString("CREATE UNIQUE (" + edge.Lhs + ")-[")
		my.buf.WriteString(name + ":" + edge.Type + "]->(" + edge.Rhs + ")")
	} else {
		my.buf.WriteString("CREATE UNIQUE (" + edge.Lhs + ")-[" + name + ":" + edge.Type + " {")

		n := 0
		insertProps := make([]string, len(edge.Props))
		updateProps := make([]string, len(edge.Props))
		for key, val := range edge.Props {
			placeholder := my.nextPlaceholder()
			insertProps[n] = key + ":{" + placeholder + "}"
			updateProps[n] = name + "." + key + "={" + placeholder + "}"
			my.params[placeholder] = val
			n += 1
		}
		my.buf.WriteString(strings.Join(insertProps, ","))
		my.buf.WriteString("}]->(" + edge.Rhs + ") SET ")
		my.buf.WriteString(strings.Join(updateProps, ","))
	}
}

func (my *StatementBuilder) AddRef(id string, node *ast.Node) {
	placeholder := my.nextPlaceholder()
	my.buf.WriteString("MATCH (" + node.Tag + " {id:{" + placeholder + "}})")
	my.params[placeholder] = id
}

func (my *StatementBuilder) writeProps(props map[string]string) {
	for key, val := range props {
		placeholder := my.nextPlaceholder()
		my.buf.WriteString(key + ":{" + placeholder + "},")
		my.params[placeholder] = val
	}
	my.buf.Truncate(my.buf.Len() - 1) // Отбрасываем лишнюю запятую
}

func (my *StatementBuilder) nextPlaceholder() string {
	my.paramIndex++
	return placeholders[my.paramIndex-1]
}
