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
	node.Props = append(node.Props, &ast.Prop{"id", id})

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

		insertProps := make([]string, len(edge.Props))
		updateProps := make([]string, len(edge.Props))
		for i, prop := range edge.Props {
			placeholder := my.nextPlaceholder()
			insertProps[i] = prop.Key + ":{" + placeholder + "}"
			updateProps[i] = name + "." + prop.Key + "={" + placeholder + "}"
			my.params[placeholder] = prop.Val
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

func (my *StatementBuilder) writeProps(props []*ast.Prop) {
	for _, prop := range props {
		placeholder := my.nextPlaceholder()
		my.buf.WriteString(prop.Key + ":{" + placeholder + "},")
		my.params[placeholder] = prop.Val
	}
	my.buf.Truncate(my.buf.Len() - 1) // Отбрасываем лишнюю запятую
}

func (my *StatementBuilder) nextPlaceholder() string {
	my.paramIndex++
	return placeholders[my.paramIndex-1]
}
