package sandbox

import (
	"fmt"
	"net/http"
	"service"
	"web"
)

var Config = service.Config{
	ServiceName: "sandbox",
	Routes: []web.Route{
		{"/", Greetings},
	},
}

func Greetings(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi! This is an example service")
}
