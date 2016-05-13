package search

import (
	"cfg"
	"db/neo"
	"ext"
	"net/http"
	"service/search/errs"
	"unicode/utf8"
	"web"
	"web/api"
)

const (
	archMapsCypher = "MATCH (am:Literature)" +
		"WHERE am.name STARTS WITH {needle} AND am.typeId = 1" +
		"RETURN am"
)

func archMapsHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForArchMaps(r.URL.Query().Get("needle"))
	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForArchMaps(needle string) ([]byte, error) {
	if needle == "" {
		return nil, errs.FilterIsEmpty
	}

	runes := utf8.RuneCountInString(needle)
	if runes < cfg.SearchMinPrefixLen {
		return nil, errs.PrefixIsTooShort
	} else if runes > cfg.SearchMaxPrefixLen {
		return nil, errs.PrefixIsTooLong
	}

	resp, err := neo.Run(archMapsCypher, neo.Params{"needle": `"` + needle + `"`})
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
			buf.Write(row.Row[0])
			buf.WriteByte(',')
		}
		buf.DropLastByte()
		buf.WriteByte(']')

		return buf.Bytes(), nil
	}
}
