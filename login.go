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

type User struct {
	Name     string `json:"username" form:"username" query:"username"`
	Password string `json:"password" form:"password" query:"password"`
}

func loginHandler(c echo.Context) error {
	user := new(User)
	if err := c.Bind(user); err != nil {
		return echo.ErrNotFound
	}

	println(user.Name, user.Password)
	if isAuthentificated(user.Name, user.Password) {
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
