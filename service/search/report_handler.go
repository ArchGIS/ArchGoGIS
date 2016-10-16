package search

import (
	"bytes"
	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"net/http"
	// "github.com/ArchGIS/ArchGoGIS/norm"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"unicode/utf8"
	"unsafe"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	reportsCypher = "MATCH (r:Report)" +
		"MATCH (res:Research)-[:hasreport]->(r)" +
		"MATCH (r)-[:hasauthor]->(a:Author)" +
		"WHERE r.name =~ {needle}" +
		"RETURN r.id, res.id, r.year, r.name"
)

func reportsHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForreports(r.URL.Query().Get("needle"))
	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForreports(needle string) ([]byte, error) {
	if needle == "" {
		return nil, errs.FilterIsEmpty
	}

	runes := utf8.RuneCountInString(needle)
	if runes < cfg.SearchMinPrefixLen {
		return nil, errs.PrefixIsTooShort
	} else if runes > cfg.SearchMaxPrefixLen {
		return nil, errs.PrefixIsTooLong
	}

	// needle = norm.NormalReport(needle)
	resp, err := neo.Run(reportsCypher, neo.Params{"needle": `"(?ui)^.*` + needle + `.*$"`})
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
