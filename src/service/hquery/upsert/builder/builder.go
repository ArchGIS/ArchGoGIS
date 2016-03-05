package builder

import (
	"bytes"
	"service/hquery/upsert/ast"
)

func UpdateEdge(edge *ast.Edge) string {
	var buf bytes.Buffer
	buf.WriteString(matchEdgeById(edge))

	if len(edge.Props) > 1 { // Не только id
		buf.WriteString(" SET ")
		writeUpdateProps(&buf, "r", edge.Props)
	}

	buf.WriteString(" RETURN 1")
	return buf.String()
}

func UpdateNode(node *ast.Node) string {
	var buf bytes.Buffer
	buf.WriteString(matchNodeById(node))

	if len(node.Props) > 1 { // Не только id
		buf.WriteString(" SET ")
		writeUpdateProps(&buf, node.Name, node.Props)
	}

	buf.WriteString(" RETURN 1")
	return buf.String()
}

func matchEdgeById(edge *ast.Edge) string {
	return "MATCH (" + edge.Lhs + ")-[r:" + edge.Type + " {id:{id}}]-(" + edge.Rhs + ")"
}

func matchNodeById(node *ast.Node) string {
	return "MATCH (" + node.Tag + " {id:{id}})"
}

func writeUpdateProps(buf *bytes.Buffer, name string, props []*ast.Prop) {
	for _, prop := range props {
		if prop.Key != "id" { // Id мы уже использовали вручную.
			buf.WriteString(name + "." + prop.Key + "={" + prop.Key + "},")
		}
	}
	buf.Truncate(buf.Len() - 1) // Отбрасываем лишнюю запятую
}
