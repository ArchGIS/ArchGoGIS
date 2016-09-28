// Hyper Query
package hquery

import (
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read2"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/upsert"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", upsert.Handler},
		{"/read", read.Handler},
		{"/read2", read2.Handler},
	},
}
