package delete

import (
	// "encoding/json"
	"fmt"
	"io"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	// "github.com/ArchGIS/ArchGoGIS/service/hquery/read"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/valid"
	"github.com/ArchGIS/ArchGoGIS/throw"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read/ast"
	"strings"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/placeholder"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/format"
)

/*
{
	"a:Author": {"id": "119",
}

{
  "Author": {
    "119": "*",
    "112": "*",
    "120": "name",
	"121": "val",
  },
  "Monument": {"10": "*"},
  "Research_Has_File": {"10_20":
  "Knowledge": {"10"}
}

MATCH (a:Author)
WHERE a.id IN [119, 112]
DELETE a
#
MATCH (a1:Author {id:120})
MATCH (a2:Author {id:121})
REMOVE a1.name, a2.val
#
MATCH (m:Monument)
WHERE m.id IN [10]
DELETE m

ast:
removes: [ Deleter{labels

заметки:
x.id IN [id...] лучше, чем x.id = 1 or x.id = 2 ...
без detach удаление будет быстрее
для props оператор удаления - remove
каждый "lables" должен идти в отдельном окне
индексы проще подцеплять если remove и delete выполняются раздельно
запретить удаление id
*/

type Data struct {
	nodes         map[string]*ast.Node
	edges         []*ast.Edge
	// optionalNodes map[string]*ast.Node
	// optionalEdges []*ast.Edge
}

type Parser struct {
	input   			parsing.Tree
	Data
}

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	params      map[string]string
	*Data
}


func mustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	this.nodes = make(map[string]*ast.Node, len(this.input))
	// this.optionalNodes = make(map[string]*ast.Node, len(this.input))
	this.edges = make([]*ast.Edge, 0, len(this.input))
	// this.optionalEdges = make([]*ast.Edge, 0, len(this.input))

	return this
}

func (my *Parser) mustParse() {
	// mustValidate(my.input)

	for tag, query := range my.input {
		my.mustParseOne(tag, query)
	}
}

var Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	parser := mustNewParser(r.Body)

	parser.mustParse()

	data := &parser.Data
	sb := NewStatementBuilder(data)

	query := neo.NewQuery(sb.Build())
	resp, err := query.Run()
	throw.If(err != nil, errs.BatchDeleteFailed)

	w.Write(format.NewJsonFormatter(resp).Bytes())
})

func mustValidate(data parsing.Tree) {
	for labels, pairs := range data {
		fmt.Printf("%#v\n", labels)
		throw.If(!valid.Identifier(labels), errs.InvalidIdentifier)
		for id, selector := range pairs {
			throw.If(!valid.Number(id), errs.PropInvalidNumber)
			throw.If(selector != "*" && !valid.Identifier(selector), errs.QueryBadSelector)
		}
	}
}


func (my *Parser) mustParseOne(tag string, query map[string]string) {
	if strings.Contains(tag, "__") {
		if tag[0] == '?' {
			my.mustParseOptionalEdge(tag[1:], query)
		} else {
			my.mustParseEdge(tag, query)
		}
	} else {
		if tag[0] == '?' {
			my.mustParseOptionalNode(tag[1:], query)
		} else {
			my.mustParseNode(tag, query)
		}
	}
}

func (my *Parser) mustParseNode(tag string, query map[string]string) {
	node := ast.MustNewNode(tag, query)
	my.nodes[node.Name] = node
}

func (my *Parser) mustParseOptionalNode(tag string, query map[string]string) {
	node := ast.MustNewNode(tag, query)
	my.nodes[node.Name] = node
}

func (my *Parser) mustParseEdge(tag string, query map[string]string) {
	my.edges = append(my.edges, ast.MustNewEdge(tag, query))
}

func (my *Parser) mustParseOptionalEdge(tag string, query map[string]string) {
	my.edges = append(my.edges, ast.MustNewEdge(tag, query))
}


func NewStatementBuilder(data *Data) *StatementBuilder {
	return &StatementBuilder{
		params: make(map[string]string),
		Data:   data,
	}
}

func (my *StatementBuilder) Build() neo.Statement {
	selection := my.scanNodes(my.nodes)

	for _, edge := range my.edges {
		if edge.Props["delete"] != "" {
			selection = append(selection, edge.Tag)
		}

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

	needWhere := true
	for _, node := range my.nodes {
		if (node.Props["filter"] != "") {
			if (needWhere) {
				my.buf.WriteString("WHERE ")
				needWhere = false
			} else {
				my.buf.WriteString("AND ")
			}

			parts := strings.Split(node.Props["filter"], "=")
			entityName := strings.Split(node.Tag, ":")[0]

			switch parts[2] {
			case "text":
				my.buf.WriteStringf(
					"%s.%s =~ '(?ui)^.*%s.*$' ",
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
					"%s.%s =~ '(?ui)^%s.*$' ",
					entityName, parts[0], parts[1],
				)
			default:
				my.buf.WriteString("")
			}
		}
	}


	my.scanNodesToDelete(my.nodes)
	my.scanDeletingEdges(my.edges)
	my.buf.Truncate(my.buf.Len() - 1)

	return neo.Statement{
		Body:   my.buf.String(),
		Params: my.params,
	}
}

func nodeMatchFmt(optional bool) string {
	if optional {
		return "OPTIONAL MATCH (%s) "
	}

	return "MATCH (%s) "
}

func (my *StatementBuilder) scanNodes(nodes map[string]*ast.Node) []string {
	selection := make([]string, 0, len(nodes))

	for _, node := range nodes {
		switch matcher := node.Props["id"]; matcher {
		case "*", "?":
			my.buf.WriteStringf("MATCH (%s) ", node.Tag)
		default:
			ph := my.placeholder.Next()
			my.buf.WriteStringf("MATCH (%s {id:{%s}}) ", node.Tag, ph)
			my.params[ph] = matcher
		}

		if _, selected := node.Props["select"]; selected {
			selection = append(selection, node.Name)
		}
	}

	return selection
}

func (my *StatementBuilder) scanNodesToDelete(nodes map[string]*ast.Node) {
	delNodes := make([]string, 0, len(nodes))
	remProps := make([]string, 0, len(nodes))
	
	for _, node := range nodes {
		if val, deleted := node.Props["delete"]; deleted {
			switch val {
			case "*":
				delNodes = append(delNodes, node.Name)
			default:
				t := strings.Split(val, ",")
				for i, v := range t {
					t[i] = node.Name + "." + v
				}
				res := strings.Join(t, ",")
				remProps = append(remProps, res)
			}
		}
	}

	if len(delNodes) != 0 {
		my.buf.WriteStringf(
			"DETACH DELETE %s ",
			strings.Join(delNodes, ","),
		)
	}
	
	if len(remProps) != 0 {
		my.buf.WriteStringf(
			"REMOVE %s ",
			strings.Join(remProps, ","),
		)
	}
}

func (my *StatementBuilder) scanDeletingEdges(edges []*ast.Edge) {
	delEdges := make([]string, 0, len(edges))

	for _, edge := range edges {
		if _, deleted := edge.Props["delete"]; deleted {
			delEdges = append(delEdges, edge.Tag)
		}
	}

	my.buf.WriteStringf(
		"DELETE %s ",
		strings.Join(delEdges, ","),
	)
}