package main

import (
	"cfg"
	"service/hquery"
	"service/i18n"
	"service/pfs"
	"service/sbox"
	"service/search"
	"service/wc"
	"web/server"
)

func main() {
	// Запуск веб-сервера (блокирующий вызов)
	panic(server.Serve(
		// Конфиг сервера:
		cfg.DevServer(),
		// Подключаемые сервисы:
		sbox.Config,
		wc.Config,
		hquery.Config,
		i18n.Config,
		search.Config,
		pfs.Config,
	))
}
