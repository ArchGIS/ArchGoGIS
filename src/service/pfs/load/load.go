package load

import (
	"net/http"
	"storage"
	"web"
)

const (
	LOAD_FILE_INPUT_NAME = "load"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	fst := storage.LocalStorage{}
	file, err := fst.load(r.FormValue(load))

	w.Write(file, err)
}
