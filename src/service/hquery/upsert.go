package hquery

import (
	"dbg"
	"fmt"
	"io"
	"net/http"
	"web"
	"web/api"
)

func Upsert(w web.ResponseWriter, r *http.Request) {
	response := processRequest(r.Body)
	fmt.Fprintf(w, "%s", response)
}

func processRequest(input io.ReadCloser) string {
	parser, err := newUpsertParser(input)
	if err != nil {
		return api.Error(err)
	}

	err = parser.parse()
	if err != nil {
		return api.Error(err)
	}

	for _, query := range parser.updates {
		dbg.Dump(query)
	}

	return api.NoError
}
