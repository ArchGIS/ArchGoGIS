package main

import (
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"

	"github.com/ArchGIS/ArchGoGIS/db/pg"
)

const (
	authSecret = "AUTH_SECRET"
)

func loginHandler(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	if isAuthentificated(username, password) {
		// Create token
		token := jwt.New(jwt.SigningMethodHS256)

		// Set claims
		claims := token.Claims.(jwt.MapClaims)
		claims["name"] = "Admin"
		claims["admin"] = false
		duration := time.Now().Add(time.Hour * 24 * 365).Unix()
		claims["exp"] = duration

		// Generate encoded token and send it as response.
		t, err := token.SignedString([]byte(os.Getenv(authSecret)))
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, map[string]string{
			"token":   t,
			"expired": string(duration),
		})
	}

	return echo.ErrUnauthorized
}

func isAuthentificated(login, password string) bool {
	query := "SELECT EXISTS(SELECT id FROM users WHERE " +
		"login = '" + login + "' AND password = '" + password + "')"

	var isLogged bool

	err := pg.Agent.QueryRow(query).Scan(&isLogged)

	if err != nil {
		log.Println(err, query)
		return false
	}

	return isLogged
}
