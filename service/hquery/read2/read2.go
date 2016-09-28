package read2

import (
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read2/parser"
	"github.com/ArchGIS/ArchGoGIS/throw"
	"github.com/ArchGIS/ArchGoGIS/web"
)

// #FIXME
func Handler(w web.ResponseWriter, r *http.Request) {
	defer throw.Catch(func(err error) {
		fmt.Printf("%+v\n", err)
	})

	var query map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&query)

	parser := parser.New(query)
	cypher := parser.GenerateCypher()

	neoQuery := neo.NewQuery(neo.Statement{string(cypher), nil})
	response, err := neoQuery.Run()
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(mustFmtJson(response, &parser.MergeData))
}
