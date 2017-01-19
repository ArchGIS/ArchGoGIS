package search

import (
	"bytes"
	"unsafe"
	"net/http"
	"encoding/json"
	"io"
	"strings"
	"strconv"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

type counts map[string][]string

const (
	matchQuery  = "OPTIONAL MATCH (x{index}:{node}) " +
							 	"WITH COUNT (x{index}) as x{index}"
	returnQuery = "x{index}"
)

var countHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	input := make(map[string][]string)
	input = mustFetchJSON(r.Body)

  result, err := searchCounts(input["counts"])

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func mustFetchJSON(reader io.ReadCloser) counts {
	var input counts
	json.NewDecoder(reader).Decode(&input)

	return input
}

func searchCounts(needle []string) ([]byte, error) {
	var matchStatement string
	returnStatement := "RETURN"
	var withStates string

	for i, node := range needle {
		var query string
		var returns string

		query = strings.Replace(matchQuery, "{index}", strconv.Itoa(i), -1)
		query = strings.Replace(query, "{node}", node, -1)

		query += withStates
		withStates += ", x" + strconv.Itoa(i)
		
		returns = strings.Replace(returnQuery, "{index}", strconv.Itoa(i), -1)

		matchStatement += query + " "
		returnStatement += " " + returns
		if i != len(needle) -1 {
			returnStatement += ","
		}
	}

	query := matchStatement + returnStatement

	resp, err := neo.Run(query, neo.Params{})
	if err != nil {
		echo.ServerError.Print(err)
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	}
	
	// Подготавливаем ответ.
	var buf ext.Xbuf

	// buf.WriteByte('[')
	for _, row := range resp.Results[0].Data {
		// #FIXME: перепиши меня, когда будет время!
		buf.WriteByte('[')
		buf.Write(
			bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
		)
		buf.WriteByte(']')
		// buf.WriteByte(',')
	}
	// buf.DropLastByte()
	// buf.WriteByte(']')

	return buf.Bytes(), nil
}