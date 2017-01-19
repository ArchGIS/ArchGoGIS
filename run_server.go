package main

import (
	"time"
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/service/hquery"
	"github.com/ArchGIS/ArchGoGIS/service/pfs"
	"github.com/ArchGIS/ArchGoGIS/service/search"
	"github.com/ArchGIS/ArchGoGIS/cfg"
	jwt "github.com/dgrijalva/jwt-go"
)


func main() {
	services := []service.Config{
		hquery.Config,
		search.Config,
		pfs.Config,
	}

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/vendor", "fs/vendor")
	e.Static("/local_storage", "fs/local_storage")
	e.Static("/web_client", "fs/web_client")
	e.Static("/locales", "fs/locales")

	e.File("/", "fs/web_client/login.html")
	e.File("/index", "fs/web_client/app.html")

	e.POST("/login", loginHandler)

	for _, config := range services {
		subRouter := e.Group("/" + config.ServiceName)

		subRouter.Use(middleware.JWT([]byte("secret")))

		for _, route := range config.Routes {
			subRouter.Any(route.Pattern, echo.WrapHandler(route.Handler))
		}
	}

	e.Logger.Fatal(e.Start(":" + cfg.DevServer().Port))
}

func loginHandler(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	if isAuthentificated(username, password) {
		// Create token
		token := jwt.New(jwt.SigningMethodHS256)

		// Set claims
		claims := token.Claims.(jwt.MapClaims)
		claims["name"] = "Jon Snow"
		claims["admin"] = true
		claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

		// Generate encoded token and send it as response.
		t, err := token.SignedString([]byte("secret"))
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, map[string]string{
			"token": t,
		})
	}

	return echo.ErrUnauthorized
}

func isAuthentificated(login, password string) bool {
	if login == "admin" && password == "qwerty" {
		return true
	}

	return false
}