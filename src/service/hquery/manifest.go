package hquery

import (
	"fmt"
	"net/http"
	"service"
	"web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", Upsert},
		{"/delete", Delete},
	},
}

func Upsert(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "todo: implement hquery upsert")
}

func Delete(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "todo: implement hquery delete")
}
