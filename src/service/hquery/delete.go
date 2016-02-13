package hquery

import (
	"fmt"
	"net/http"
	"web"
)

func Delete(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "todo: implement hquery delete")
}
