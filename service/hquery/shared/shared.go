package shared

import (
	"github.com/ArchGIS/ArchGoGIS/cfg"
	"io"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/throw"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

func Handle(w web.ResponseWriter, r *http.Request, responder func(io.ReadCloser) []byte) {
	defer throw.Catch(func(err error) {
		if _, ok := err.(*errs.HqueryError); ok {
			w.Write([]byte(err.Error()))
		} else {
			// Runtime ошибка?
			panic(err)
		}
	})

	if r.ContentLength > cfg.HqueryUpsertMaxInputLen {
		w.Write(api.Error(errs.InputIsTooBig))
	}

	w.Write(responder(r.Body))
}
