package search

import (
	"net/http"
	"unicode/utf8"

	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	oknsCypher = "MATCH (o:Heritage)" +
		"WHERE o.name =~ {needle}" +
		"OPTIONAL MATCH (o)-[:has]->(spatref:StatialReference)" +
		"RETURN {
			id: o.id,
			x: o.x,
			y: o.y,
			name: o.name,
			spatrefX: spatref.x,
			spatrefY: spatref.y
			}"
)

var oknsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForOkns(r.URL.Query().Get("needle"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForOkns(needle string) ([]byte, error) {
	if needle == "" {
		return nil, errs.FilterIsEmpty
	}

	runes := utf8.RuneCountInString(needle)
	if runes < cfg.SearchMinPrefixLen {
		return nil, errs.PrefixIsTooShort
	} else if runes > cfg.SearchMaxPrefixLen {
		return nil, errs.PrefixIsTooLong
	}

	// needle = norm.NormalPerson(needle)
	resp, err := neo.Run(oknsCypher, neo.Params{"needle": `"(?ui)^.*` + needle + `.*$"`})
	if err != nil {
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	}

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
