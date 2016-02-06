package handler

import (
	"net/http"
	"tmpl"
	"web"
)

func Root(w web.ResponseWriter, r *http.Request) {
	data := struct{ Text string }{"=)"}
	tmpl.Render(w, "/", data)
}
