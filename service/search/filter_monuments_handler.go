package search

import (
	"bytes"
	"net/http"
	"unsafe"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterMonumentsCypher = "MATCH (m:Monument)" +
		"MATCH (k:Knowledge)-[:belongsto]->(m)" +
		"MATCH (r:Research)-[:has]->(k)" +
		"MATCH (a:Author)<-[:hasauthor]-(r)"
)

var filterMonumentsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForFilterMonuments(
		r.URL.Query().Get("name"),
		r.URL.Query().Get("epoch"),
		r.URL.Query().Get("type"),
		r.URL.Query().Get("resId"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForFilterMonuments(mnt, epoch, mType, resId string) ([]byte, error) {
	params := neo.Params{}
	query := filterMonumentsCypher
	ifResId := ""
	haveThisRes := ""

	if mnt != "" {
		query = query + "WHERE k.monument_name =~ {mnt} "
		params["mnt"] = `"(?ui)^.*` + mnt + `.*$"`
	}

	if resId != "" {
		query = query + "OPTIONAL MATCH (r2:Research {id: {resId}})-[rel]-(k2:Knowledge)--(m)"
		ifResId = ", rel "
		haveThisRes = "haveThisRes: rel, "
		params["resId"] = resId
	}

	query = query +
		"OPTIONAL MATCH (m)-[:has]->(monType:MonumentType)" +
		"OPTIONAL MATCH (e:Epoch)<-[:has]-(m)" +
		"OPTIONAL MATCH (c:Culture)<-[:has]-(k)" +
		"WITH m, k, r, a, monType, e, c " +
		ifResId

	flag := false
	if epoch != "" {
		query = query + "WHERE e.id = {epoch} "
		params["epoch"] = epoch
		flag = true
	}
	if mType != "" {
		if flag {
			query = query + "AND monType.id = {mType} "
		} else {
			query = query + "WHERE monType.id = {mType} "
		}

		params["mType"] = mType
	}

	query = query + "RETURN {" +
		"monId: m.id, " +
		"monName: k.monument_name, " +
		"resYear: r.year, " +
		"autName: a.name, " +
		"ep: e.id, " +
		"epName: e.name, " +
		"en_epName: e.en_name, " +
		"cult: c.name, " +
		"en_cult: c.en_name, " +
		"x: k.x, " +
		"y: k.y, " +
		"kId: k.id, " +
		haveThisRes +
		"monType: monType.name, " +
		"en_monType: monType.en_name, " +
		"monTypeId: monType.id}"

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
