package pfs

import (
	"echo"
	"net/http"
	"service/pfs/errs"
	"web"
	"web/api"
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
