package hquery

import (
	"service"
	"service/hquery/upsert"
	"web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", upsert.Handler},
		{"/delete", Delete},
	},
}
