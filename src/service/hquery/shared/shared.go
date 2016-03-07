package shared

import (
	"cfg"
	"io"
	"net/http"
	"service/hquery/errs"
	"throw"
	"web"
	"web/api"
)

func Handle(w web.ResponseWriter, r *http.Request, responder func(io.ReadCloser) []byte) {
	defer throw.Catch(func(err error) {
		if _, ok := err.(errs.HqueryError); ok {
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
