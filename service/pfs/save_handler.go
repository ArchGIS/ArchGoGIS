package pfs

import (
	"io/ioutil"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	// MaxMemory is constraint for files size
	MaxMemory     = 32 << 20
	// FileInputName is key for uploaded files
	FileInputName = "key"
)

var saveHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(MaxMemory)

	file, _, err := r.FormFile(FileInputName)
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
})
