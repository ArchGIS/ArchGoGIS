package search

import (
	"cfg"
	"db/neo"
	"ext"
	"net/http"
	"norm"
	"service/search/errs"
	"unicode/utf8"
	"web"
	"web/api"
)

const (
	monumnetsCypher = "MATCH (m:Monument)" +
		"MATCH (k:Knowledge)-[:Describes]->(m)" +
		"WHERE k.name STARTS WITH {needle}" +
		"RETURN m, k"
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

	needle = norm.Name(needle)
	resp, err := neo.Run(monumnetsCypher, neo.Params{"needle": `"` + needle + `"`})
	if err != nil {
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	} else {
		// Подготавливаем ответ.
		var buf ext.Xbuf

		buf.WriteByte('[')
		for _, row := range resp.Results[0].Data {
			buf.WriteByte('[')
			buf.Write(row.Row[0])
			buf.WriteByte(',')
			buf.Write(row.Row[1])
			buf.WriteByte(']')
			buf.WriteByte(',')
		}
		buf.DropLastByte()
		buf.WriteByte(']')

		return buf.Bytes(), nil
	}
}
