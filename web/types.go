package web

import (
	"net/http"
)

type HandlerFunc func(ResponseWriter, *http.Request)

type Route struct {
	Pattern string
	Handler HandlerFunc
}

type ResponseWriter struct {
	http.ResponseWriter
}
