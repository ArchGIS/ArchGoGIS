package search

import (
	"bytes"
	"unsafe"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterExcavationCypher = "MATCH (r:Excavation)" + 
		"MATCH (a:Author)--(res:Research)--(r)"
)


var filterExcavationHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForFilterExcavation(
		r.URL.Query().Get("author"),
		r.URL.Query().Get("year"),
		r.URL.Query().Get("authorid"),
		r.URL.Query().Get("resid"))


	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForFilterExcavation(author, year, authorid, resid string) ([]byte, error) {
	params := neo.Params{}
	query := filterExcavationCypher + "WHERE "
	first := true

	if year != "" {
		if authorid != "" {
			query = query + "(a.id = {authorid} AND res.year = {year}) "
		} else {
			query = query + "res.year = {year} "
		}
		first = false

		params["authorid"] = authorid
		params["year"] = year
	}
	if author != "" {
		if first {
			query = query + "a.name =~ {author} "
		} else {
			query = query + "AND a.name =~ {author} "
		}
		first = false

		params["author"] = `"(?ui)^.*` + author + `.*$"`
	}
	if resid != "" {
		if first {
			query = query + "res.id = {resid} "
		} else {
			query = query + "OR res.id = {resid} "
		}

		params["resid"] = resid
	}

	query = query + "OPTIONAL MATCH (r)--(sp:SpatialReference)--(spt:SpatialReferenceType)"

	query = query + "WITH {" +
		"id: r.id, " +
		"name: r.name, " +
		"area: r.area, " +
		"resYear: res.year, " +
		"resId: res.id, " +
		"resName: res.name, " +
		"x: sp.x, " +
		"y: sp.y, " +
		"date: sp.date, " +
		"spType: spt.name, " +
		"authorId: a.id, " +
		"author: a.name} as r " +
		"RETURN r " +
		"ORDER BY r.spType ASC, r.date DESC " +
		"LIMIT 1"

	resp, err := neo.Run(query, params)

	if err != nil {
		echo.ServerError.Print(err)
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	}

	// Подготавливаем ответ.
	var buf ext.Xbuf

	buf.WriteByte('[')
	for _, row := range resp.Results[0].Data {
		buf.Write(
			bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
		)
		buf.WriteByte(',')
	}
	buf.DropLastByte()
	buf.WriteByte(']')

	return buf.Bytes(), nil
}
