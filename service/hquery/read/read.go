package read

import (
	"io"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/ext/xstr"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/format"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/shared"
	"github.com/ArchGIS/ArchGoGIS/throw"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

var Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
})

func mustProcessRequest(input io.ReadCloser, limit string) []byte {
	data := mustParse(input)

	sb := NewStatementBuilder(data)

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
