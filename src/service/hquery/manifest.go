package hquery

import (
	"service"
	"service/hquery/read"
	"service/hquery/upsert"
	"web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", upsert.Handler},
		{"/read", read.Handler},
		{"/delete", Delete},
	},
}
