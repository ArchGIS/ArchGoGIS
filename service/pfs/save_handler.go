package pfs

import (
	"github.com/ArchGIS/ArchGoGIS/echo"
	"io/ioutil"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
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