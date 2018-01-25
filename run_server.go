package main

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"

	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/service/calibrate"
	"github.com/ArchGIS/ArchGoGIS/service/hquery"
	"github.com/ArchGIS/ArchGoGIS/service/pfs"
	"github.com/ArchGIS/ArchGoGIS/service/search"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	services := []service.Config{
		hquery.Config,
		search.Config,
		pfs.Config,
		calibrate.Config,
	}

	e := echo.New()

	e.Debug = true

	e.Use(middleware.Logger())
	e.Logger.SetLevel(log.DEBUG)
	e.Use(middleware.Recover())
	e.Use(addOptions())
	e.Use(handleOptions())

	e.Static("/vendor", "fs/vendor")
	e.Static("/local_storage", "fs/local_storage")
	e.Static("/web_client", "fs/web_client")
	e.Static("/locales", "fs/locales")

	e.File("/", "fs/web_client/login.html")
	e.File("/index", "fs/web_client/app.html")

	e.POST("/login", loginHandler)

	for _, config := range services {
		subRouter := e.Group("/" + config.ServiceName)

		subRouter.Use(middleware.JWT([]byte(os.Getenv(authSecret))))

		for _, route := range config.Routes {
			subRouter.Any(route.Pattern, echo.WrapHandler(route.Handler))
		}
	}

	go func() {
		e.Start(":8282")
	}()

	e.Logger.Fatal(e.Start(":" + cfg.DevServer().Port))
}

func addOptions() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			origin := c.Request().Header.Get("Origin")
			c.Response().Header().Set("Access-Control-Allow-Origin", origin)
			return next(c)
		}
	}
}

func handleOptions() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Request().Method == "OPTIONS" {
				c.Response().Header().Set("Allow", "OPTIONS, GET, POST")
				c.Response().Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				return nil
			}

			return next(c)
		}
	}
}
