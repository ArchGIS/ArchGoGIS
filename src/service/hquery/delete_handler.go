package hquery

import (
	"fmt"
	"net/http"
	"web"
)

func deleteHandler(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "todo: implement hquery delete")
}
