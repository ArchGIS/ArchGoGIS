package main

import (
	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/service/graphed"
	"github.com/ArchGIS/ArchGoGIS/service/hquery"
	"github.com/ArchGIS/ArchGoGIS/service/i18n"
	"github.com/ArchGIS/ArchGoGIS/service/pfs"
	"github.com/ArchGIS/ArchGoGIS/service/sbox"
	"github.com/ArchGIS/ArchGoGIS/service/search"
	"github.com/ArchGIS/ArchGoGIS/service/vending"
	"github.com/ArchGIS/ArchGoGIS/service/wc"
	"github.com/ArchGIS/ArchGoGIS/web/server"
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
		vending.Config,
		graphed.Config,
	))
}
