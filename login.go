package main

import (
  "time"
  "os"
	"net/http"

  "github.com/labstack/echo"
  jwt "github.com/dgrijalva/jwt-go"
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
		claims["admin"] = true
		claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

		// Generate encoded token and send it as response.
    t, err := token.SignedString([]byte(os.Getenv(authSecret)))
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