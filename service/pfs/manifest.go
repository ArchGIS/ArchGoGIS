// Persistent file storage
package pfs

import (
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	StaticPath:  "local_storage",
	ServiceName: "pfs",
	Routes: []web.Route{
		{"/save", saveHandler},
		{"/load", loadHandler},
		{"/url", urlHandler},
	},
}
