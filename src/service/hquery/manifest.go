package hquery

import (
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
