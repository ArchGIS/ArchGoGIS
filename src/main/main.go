package main

import (
	"cfg"
	"service/hquery"
	"service/sandbox"
	"service/wc"
	"web/server"
)

func main() {
	// Запуск веб-сервера (блокирующий вызов)
	panic(server.Serve(
		cfg.DefaultServer(),
		sandbox.Config,
		wc.Config,
		hquery.Config,
	))
}
