package url

import (
	"echo"
	"net/http"
	"storage"
	"web"
)

const (
	URL_INPUT_NAME = "url"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	fst := storage.LocalStorage{}
	url, err := fst.Url(r.FormValue(URL_INPUT_NAME))
	if err != nil {
		echo.ServerError.Print(err)
	}

	w.Write([]byte(url))
}
