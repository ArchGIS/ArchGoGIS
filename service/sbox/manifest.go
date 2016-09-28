// Sandbox
package sbox

import (
	"fmt"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	StaticPath:  "sandbox",
	ServiceName: "sbox",
	Routes: []web.Route{
		{"/", Greetings},
	},
}

func Greetings(w web.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi! This is an example service")
}
