package web

import (
	"echo"
	"net/http"
)

type HandlerFunc func(ResponseWriter, *http.Request)

func handleFunc(route string, handler HandlerFunc) {
	http.HandleFunc(route, promote(handler))
}

func promote(handler HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		echo.Info.Printf("%s requests %s", r.RemoteAddr, r.RequestURI)
		handler(ResponseWriter{w}, r)
	}
}
