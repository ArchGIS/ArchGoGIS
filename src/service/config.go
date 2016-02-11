package service

import (
	"web"
)

type Config struct {
	StaticPath  string
	ServiceName string
	Routes      []web.Route
}
