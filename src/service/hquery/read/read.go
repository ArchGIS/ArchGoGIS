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

	query := neo.NewQuery(sb.Build())
	resp, err := query.Run()
	if err != nil {
		return api.Error(errs.BatchReadFailed)
	}

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
