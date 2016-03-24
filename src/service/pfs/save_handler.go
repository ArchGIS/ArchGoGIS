package pfs

import (
	"echo"
	"io/ioutil"
	"net/http"
	"service/pfs/errs"
	"web"
	"web/api"
)

const (
	maxMemory       = 32 << 20
	FILE_INPUT_NAME = "files"
)

func saveHandler(w web.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(maxMemory)

	file, _, err := r.FormFile(FILE_INPUT_NAME)
	if err != nil {
		echo.ClientError.Print(err)
		w.Write(api.Error(errs.SaveFileDataError))
		return
	}
	defer file.Close()

	fileContents, err := ioutil.ReadAll(file)
	if err != nil {
		echo.ServerError.Print(err)
		w.Write(api.Error(errs.SaveFileDataError))
		return
	}

	key, err := agent.Save(fileContents)
	if err != nil {
		echo.VendorError.Print(err)
		w.Write(api.Error(errs.SaveServerError))
		return
	}

	echo.Info.Print("writing bytes:", len(fileContents))

	w.Write([]byte(`{"key":"` + key + `"}`))
}
