package cfg

import (
	"web/server"
)

func DefaultServer() server.Config {
	return server.Config{
		Port: "8080",
	}
}
