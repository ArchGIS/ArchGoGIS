package main

import (
	"cfg"
	"service/sandbox"
	"web/server"
)

func main() {
	// Запуск веб-сервера (блокирующий вызов)
	panic(server.Serve(
		cfg.DefaultServer(),
		sandbox.Config,
	))
}
