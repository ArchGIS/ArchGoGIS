package search

import (
	"bytes"
	"unsafe"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterResCypher = "MATCH (r:Research)" +
		"MATCH (a:Author)<-[:hasauthor]-(r)" +
		"MATCH (k:Knowledge)<-[:has]-(r)"
)


func filterResHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForFilterRes(
		r.URL.Query().Get("year"),
		r.URL.Query().Get("author"))


	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForFilterRes(year, author string) ([]byte, error) {
	params := neo.Params{}
	query := filterResCypher + "WHERE "
	first := false

	if year != "" {
		query = query + "r.year = {year} "
		first = true
		params["year"] = year
	}
	if author != "" {
		if first {
			query = query + "AND a.name =~ {author} "
		} else {
			query = query + "a.name =~ {author} "
			// first = true
		}

		params["author"] = `"(?ui)^.*` + author + `.*$"`
	}
	
	query = query + "RETURN r.id, r.name, r.year, a.name, k.x, k.y"

	resp, err := neo.Run(query, params)

	if err != nil {
		echo.ServerError.Print(err)
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	} else {
		// Подготавливаем ответ.
		var buf ext.Xbuf

		buf.WriteByte('[')
		for _, row := range resp.Results[0].Data {
			// #FIXME: перепиши меня, когда будет время!
			buf.WriteByte('[')
			buf.Write(
				bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
			)
			buf.WriteByte(']')
			buf.WriteByte(',')
		}
		buf.DropLastByte()
		buf.WriteByte(']')

		return buf.Bytes(), nil
	}
}
