// Persistent file storage
package pfs

import (
	"service"
	"web"
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
