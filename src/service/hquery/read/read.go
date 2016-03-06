package read

import (
	"cfg"
	"db/neo"
	"ext/xstr"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/format"
	"service/hquery/read/builder"
	"service/hquery/shared"
	"throw"
	"web"
	"web/api"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	limit := r.URL.Query().Get("limit")
	if xstr.NumericalGt(limit, cfg.HqueryReadMaxLimit) {
		w.Write(api.Error(errs.LimitParamOverflow))
	} else {
		if limit == "" {
			limit = cfg.HqueryReadDefaultLimit
		}

		shared.Handle(w, r, func(input io.ReadCloser) []byte {
			return mustProcessRequest(input, limit)
		})
	}
}

func mustProcessRequest(input io.ReadCloser, limit string) []byte {
	data := mustParse(input)

	sb := builder.NewStatementBuilder(data.nodes, data.edges)

	query := neo.NewQuery(sb.Build(limit))
	resp, err := query.Run()
	throw.If(err != nil, errs.BatchReadFailed)

	return format.NewJsonFormatter(resp).Bytes()
}

func mustParse(input io.ReadCloser) *Data {
	parser := MustNewParser(input)

	parser.mustParse()

	return &parser.Data
}
