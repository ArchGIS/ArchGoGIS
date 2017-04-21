package read

import (
	"strings"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read/ast"
)

func stringInSlice(a string, list []string) bool {
    for _, b := range list {
        if b == a {
            return true
        }
    }
    return false
}

func NewStatementBuilder(data *Data) *StatementBuilder {
	return &StatementBuilder{
		params: make(map[string]string),
		Data:   data,
	}
}

func nodeMatchFmt(optional bool) string {
	if optional {
		return "OPTIONAL MATCH (%s)"
	}

	return "MATCH (%s)"
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
			distinct := ""

			if node.Props["options"] != "" {
				options := strings.Split(node.Props["options"], ";")

				if (stringInSlice("uniq", options)) {
					distinct = "distinct "	
				}
			}

			switch node.Props["id"] {
			case "?":
				my.buf.WriteString("(CASE WHEN LENGTH(COLLECT(" + node.Name + "))=1 ")
				my.buf.WriteString("THEN HEAD(COLLECT(" + node.Name + ")) ELSE NULL END) ")
				my.buf.WriteString("AS " + node.Name + ",")
			case "*":
				my.buf.WriteString("COLLECT(" + distinct + node.Name + ") AS " + node.Name + ",")
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

	for _, edge := range my.edges {
		if (edge.Type == "none") {
			my.buf.WriteStringf(
				"MATCH (%s)--(%s)",
				edge.Lhs, edge.Rhs,
			)
		} else {
			my.buf.WriteStringf(
				"MATCH (%s)-[%s:%s]->(%s)",
				edge.Lhs, edge.Tag, edge.Type, edge.Rhs,
			)
		}
	}

	firstFilter := true

	for _, node := range my.nodes {
		if (node.Props["filter"] != "") {
			filters := strings.Split(node.Props["filter"], ";")
			entityName := strings.Split(node.Tag, ":")[0]

			for _, filter := range filters {
				parts := strings.Split(filter, "=")

				if (firstFilter) {
					my.buf.WriteStringf(
						"WHERE ",
					)
					firstFilter = false
				} else {
					my.buf.WriteStringf(
						"AND ",
					)
				}

				switch parts[2] {
				case "text":
					my.buf.WriteStringf(
						"%s.%s =~ '(?ui)^.*(%s).*$' ",
						entityName, parts[0], parts[1],
					)
				case "textExact":
					my.buf.WriteStringf(
						"%s.%s = '%s'",
						entityName, parts[0], parts[1],
					)	
				case "less":
					my.buf.WriteStringf(
						"%s.%s <= %s ",
						entityName, parts[0], parts[1],
					)
				case "more":
					my.buf.WriteStringf(
						"%s.%s >= %s ",
						entityName, parts[0], parts[1],
					)
				case "number":
					my.buf.WriteStringf(
						"%s.%s = %s ",
						entityName, parts[0], parts[1],
					)
				case "textStart":
					my.buf.WriteStringf(
						"%s.%s =~ '(?ui)^(%s).*$' ",
						entityName, parts[0], parts[1],
					)
				default:
					my.buf.WriteString("")
				}
			}
		}
	}

	optionalSelection := my.scanNodes(true, my.optionalNodes)

	for _, edge := range my.optionalEdges {
		if edge.Props["select"] != "" {
			optionalSelection = append(optionalSelection, edge.Tag)
		}

		my.buf.WriteStringf(
			"OPTIONAL MATCH (%s)-[%s:%s]->(%s)",
			edge.Lhs, edge.Tag, edge.Type, edge.Rhs,
		)
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
		Body:   my.buf.String(),
		Params: my.params,
	}
}
