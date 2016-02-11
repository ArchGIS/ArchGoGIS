package web

import (
	"net/http"
)

type HandlerFunc func(ResponseWriter, *http.Request)
