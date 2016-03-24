package cfg

import (
	"web/server"
)

func DevServer() server.Config {
	return server.Config{
		Port: "8080",
		Dns:  "localhost",
		Host: "localhost:8080",
	}
}
