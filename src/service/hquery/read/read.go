package read

import (
	"cfg"
	"db/neo"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/format"
	"service/hquery/read/builder"
	"throw"
	"web"
	"web/api"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	defer func() {
		if errorCode := recover(); errorCode != nil {
			w.Write([]byte(errorCode.(error).Error()))
		}
	}()

	if r.ContentLength > cfg.HqueryReadMaxInputLen {
		w.Write(api.Error(errs.InputIsTooBig))
	}

	w.Write(mustProcessRequest(r.Body))
}

func mustProcessRequest(input io.ReadCloser) []byte {
	data := mustParse(input)

	sb := builder.NewStatementBuilder(len(data.nodes))
	for _, node := range data.nodes {
		switch matcher := node.Props["id"]; matcher {
		case "*", "?":
			sb.AddNodeMatch(node.Tag)
		default:
			sb.AddRef(matcher, node.Tag)
		}
	}

	for _, edge := range data.edges {
		sb.AddEdgeMatch(edge)
	}

	sb.AddNodesReturn(data.nodes)
	sb.AddEdgesReturn(data.edges)

	query := neo.NewQuery(sb.Build())
	resp, err := query.Run()
	throw.If(err != nil, errs.BatchReadFailed)

	return format.NewJsonFormatter(resp).Bytes()
}

func mustParse(input io.ReadCloser) *Data {
	parser := MustNewParser(input)

	parser.mustParse()

	return &parser.Data
}
