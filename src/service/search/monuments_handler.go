package search

import (
	"bytes"
	"cfg"
	"db/neo"
	"echo"
	"ext"
	"net/http"
	"norm"
	"service/search/errs"
	"unicode/utf8"
	"unsafe"
	"web"
	"web/api"
)

const (
	monumnetsCypher = "MATCH (m:Monument)" +
		"MATCH (k:Knowledge)-[:Describes]->(m)" +
		"MATCH (m)-[:EpochOf]->(e:Epoch)" +
		"MATCH (m)-[:TypeOf]->(ty:MonumentType)" +
		"WHERE k.name STARTS WITH {needle}" +
		"RETURN m, k, ty.id, e.id"
)

func monumentsHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForMonuments(r.URL.Query().Get("needle"))
	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForMonuments(needle string) ([]byte, error) {
	if needle == "" {
		return nil, errs.FilterIsEmpty
	}

	runes := utf8.RuneCountInString(needle)
	if runes < cfg.SearchMinPrefixLen {
		return nil, errs.PrefixIsTooShort
	} else if runes > cfg.SearchMaxPrefixLen {
		return nil, errs.PrefixIsTooLong
	}

	needle = norm.NormalMonument(needle)
	resp, err := neo.Run(monumnetsCypher, neo.Params{"needle": `"` + needle + `"`})
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
