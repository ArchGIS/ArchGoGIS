// persistent file storage
package pfs

import (
	"service"
	"service/pfs/save"
	// "service/pfs/url"
	"web"
)

var Config = service.Config{
	// StaticPath:  "local_storage",
	ServiceName: "pfs",
	Routes: []web.Route{
		{"/save", save.Handler},
		// {"/url", url.Handler},
	},
}
