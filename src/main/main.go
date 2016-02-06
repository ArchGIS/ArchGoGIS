package main

import (
	"handler"
	"web"
)

func main() {
	web.Serve("8080", []web.Route{
		{"/db/hquery/upsert", handler.HqueryUpsert},
		{"/test/echo", handler.TestEcho},
		{"/test/hquery", handler.TestHquery},
		{"/", handler.Root},
	})
}
