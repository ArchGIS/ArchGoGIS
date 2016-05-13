package search

import (
	"service"
	"web"
)

var Config = service.Config{
	ServiceName: "search",
	Routes: []web.Route{
		{"/authors", authorsHandler},
		{"/monuments", monumentsHandler},
		{"/archMaps", archMapsHandler},
	},
}
