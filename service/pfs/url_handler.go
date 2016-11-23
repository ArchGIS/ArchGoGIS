package pfs

import (
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

func urlHandler(w web.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")

	if "" == key {
		w.Write(api.Error(errs.UrlNoKey))
	} else {
		url, err := agent.Url(key)

		if err != nil {
			echo.VendorError.Print(err)
			w.Write(api.Error(errs.UrlNotFound))
		} else {
			w.Write([]byte(`{"url":"` + url + `"}`))
		}
	}

}
