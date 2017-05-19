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
  filterRadiocarbonCypher = "MATCH (r:Radiocarbon)--(sp:SpatialReference)--(spt:SpatialReferenceType)"
)


var filterRadiocarbonHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
  result, err := searchForFilterRadiocarbon(
    r.URL.Query().Get("name"))

  if err == nil {
    w.Write(result)
  } else {
    w.Write(api.Error(err))
  }
})

func searchForFilterRadiocarbon(name string) ([]byte, error) {
  params := neo.Params{}
  query := filterRadiocarbonCypher

  if name != "" {
    query = query + " WHERE r.name =~ {name} "

    params["name"] = `"(?ui)^.*` + name + `.*$"`
  }

  query = query + "OPTIONAL MATCH (r)--(e:Excavation)--(excSp:SpatialReference)--(excSpt:SpatialReferenceType) "
  query = query + "OPTIONAL MATCH (r)--(k:Knowledge)--(m:Monument)--(monSp:SpatialReference)--(monSpt:SpatialReferenceType) " 

  query = query + "WITH distinct {" +
    "carbon: r, " +
    "id: r.id, " +
    "excX: excSp.x, " +
    "excY: excSp.y, " +
    "excDate: excSp.date, " +
    "excType: excSpt.id, " +
    "monX: monSp.x, " +
    "monY: monSp.y, " +
    "monDate: monSp.date, " +
    "monType: monSpt.id, " +
    "x: sp.x, " +
    "y: sp.y, " +
    "date: sp.date, " +
    "type: spt.id} as r " +
    "RETURN r " + 
    "ORDER BY r.id ASC, r.type ASC, r.date DESC, r.excType ASC, r.excDate DESC, r.monType ASC, r.monDate DESC "

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
