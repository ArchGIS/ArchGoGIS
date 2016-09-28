package pfs

import (
	"github.com/ArchGIS/ArchGoGIS/echo"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

func loadHandler(w web.ResponseWriter, r *http.Request) {
	fileContents, err := agent.Load(r.FormValue("key"))
	if err != nil {
		echo.VendorError.Print(err)
		w.Write(api.Error(errs.LoadServerError))
	} else {
		w.Write(fileContents)
	}
}
