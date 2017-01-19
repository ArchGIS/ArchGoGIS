package pfs

import (
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

var loadHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	fileContents, err := agent.Load(r.FormValue("key"))

	if err != nil {
		echo.VendorError.Print(err)
		w.Write(api.Error(errs.LoadServerError))
	} else {
		w.Write(fileContents)
	}
})
