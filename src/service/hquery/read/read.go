package read

import (
	"cfg"
	"db/neo"
	"fmt"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/format"
	"service/hquery/read/builder"
	"web"
	"web/api"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	if r.ContentLength > cfg.HqueryReadMaxInputLen {
		fmt.Fprint(w, api.Error(errs.InputIsTooBig))
	}

	response := processRequest(r.Body)
	fmt.Fprint(w, response)
}

func processRequest(input io.ReadCloser) string {
	data, err := parse(input)
	if err != nil {
		return api.Error(err)
	}

	fmt.Printf("%+v\n", data)

	sb := builder.NewStatementBuilder(len(data.nodes))
	for _, node := range data.nodes {
		if node.Matcher.Exact() {
			sb.AddRef(string(node.Matcher), node.Tag)
		} else {
			sb.AddNodeMatch(node.Tag)
		}
	}

	for _, edge := range data.edges {
		sb.AddEdgeMatch(edge)
	}

	sb.AddNodesReturn(data.nodes)
	sb.AddEdgesReturn(data.edges)

	// fmt.Printf("%+v\n", sb.Build())

	query := neo.NewQuery(sb.Build())
	resp, err := query.Run()
	if err != nil {
		return api.Error(errs.BatchReadFailed)
	}

	/*
		batch := neo.Batch{
			make([]neo.Statement, 0, len(data.edges)+len(data.nodes)),
		}
	*/

	/*
			MATCH (m:Monument {id: 30})
			MATCH (author:Author)
			MATCH (coauthor:Author)
			MATCH (art:Artifact)

			"r:Research": ["10", "id", "year"],
		  	"author:Author": ["?", "id", "name", "birth_date"],
		  	"m:Monument": ["*", "id", "x", "y", "epoch"],
		  	"coauthor:Author": ["*", "id", "name", "birth_date"],
	*/

	/*
		for _, node := range data.nodes {
			batch.Add(
				"MATCH (" + node.Name + ""
			)
			batch.Add(builder.UpdateNode(node), propsToParams(node.Props))
		}
	*/

	return string(format.NewJsonFormatter(resp).Bytes())
}

func parse(input io.ReadCloser) (*Data, error) {
	parser, err := NewParser(input)
	if err != nil {
		return nil, err
	}

	err = parser.parse()
	if err != nil {
		return nil, err
	}

	return &parser.Data, nil
}
