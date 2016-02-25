package main

import (
	"cfg"
	"service/hquery"
	"service/i18n"
	"service/sbox"
	"service/wc"
	"web/server"
)

func main() {
	// Запуск веб-сервера (блокирующий вызов)
	panic(server.Serve(
		// Конфиг сервера:
		cfg.DefaultServer(),
		// Подключаемые сервисы:
		sbox.Config,
		wc.Config,
		hquery.Config,
		i18n.Config,
	))
}
