package service

import (
	"github.com/ArchGIS/ArchGoGIS/web"
)

type Config struct {
	StaticPath  string
	ServiceName string
	Routes      []web.Route

	// - StaticPath -
	// Путь для статических файлов, которые нужно обслуживать.
	// Если не задано (пустая строка), то у сервиса не будет файлового сервера.
	// Файлы обслуживаются без префикса ServiceName
	// и извлекаются из директории `/fs/`.

	// - ServiceName -
	// Помогает идентифицировать сервис и создать для него свой namespace
	// в роутинге. Все роуты сервиса работают относительно ServiceName.
	// Например при ServiceName="foo" и одном из роутов "/",
	// вместо
	// `http://localhost:8080/`
	// будет прослушиваться
	// `http://localhost:8080/foo/`

	// - Routes -
	// Обрабатываемые url's для сервиса.
}
