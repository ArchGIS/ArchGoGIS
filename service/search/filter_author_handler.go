package search

import (
	"bytes"
	"net/http"
	"unsafe"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterAuthorCypher = "MATCH (a:Author)"
)

func filterAuthorHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForFilterAuthor(
		r.URL.Query().Get("author"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForFilterAuthor(author string) ([]byte, error) {
	params := neo.Params{}
	query := filterAuthorCypher + "WHERE "

	if author != "" {
		query = query + "a.name =~ {author} "

		params["author"] = `"(?ui)^.*` + author + `.*$"`
	}

	query = query + "RETURN a.id, a.name, a.birthdate"

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
