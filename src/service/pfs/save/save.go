package save

import (
	"echo"
	"io/ioutil"
	"net/http"
	"storage"
	"web"
)

const (
	maxMemory       = 32 << 20
	FILE_INPUT_NAME = "files"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(maxMemory)

	file, handler, err := r.FormFile(FILE_INPUT_NAME)
	if err != nil {
		echo.ServerError.Print(err)
		return
	}
	defer file.Close()

	fst := storage.LocalStorage{}
	fileContents, err := ioutil.ReadAll(file)
	if err != nil {
		echo.ServerError.Print(err)
	}
	err = fst.Save(handler.Filename, fileContents)
	if err != nil {
		echo.ServerError.Print(err)
	}
	echo.Info.Print("bytes:", len(fileContents))

	w.Write([]byte("success"))
}
