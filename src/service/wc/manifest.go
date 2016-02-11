package wc

import (
	"service"
)

var Config = service.Config{
	StaticPath:  "web_client",
	ServiceName: "wc",
	Routes:      nil,
}
