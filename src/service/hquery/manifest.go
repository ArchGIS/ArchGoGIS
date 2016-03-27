// Hyper Query
package hquery

import (
	"service"
	"service/hquery/read"
	"service/hquery/read2"
	"service/hquery/upsert"
	"web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", upsert.Handler},
		{"/read", read.Handler},
		{"/read2", read2.Handler},
	},
}
