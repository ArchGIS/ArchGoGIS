package req

import (
	"net/http"
)

type HeaderLine struct {
	Key   string
	Value string
}

type Connection struct {
	Client      *http.Client
	HeaderLines []HeaderLine
}
