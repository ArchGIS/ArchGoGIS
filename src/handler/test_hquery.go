package handler

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"web"
)

func TestHquery(w web.ResponseWriter, r *http.Request) {
	page, _ := ioutil.ReadFile("public/view/test.html")
	fmt.Fprintf(w, string(page))
}
