package vending

import (
	"service"
)

var Config = service.Config{
	StaticPath:  "vendor",
	ServiceName: "vending",
}
