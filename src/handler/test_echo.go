package handler

import (
	"fmt"
	"net/http"
	"web"
)

func TestEcho(w web.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Fprintf(w, "%+v", r.Form)
}
