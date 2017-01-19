package read2

import (
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"encoding/json"
	"fmt"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read2/parser"
	"github.com/ArchGIS/ArchGoGIS/throw"
)

// #FIXME
var Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	defer throw.Catch(func(err error) {
		if _, ok := err.(*errs.HqueryError); ok {
			w.Write([]byte(err.Error()))
		} else {
			// Runtime ошибка?
			panic(err)
		}
	})

	var query map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&query)

	parser := parser.New(query)
	cypher := parser.GenerateCypher()
	fmt.Printf("%#v\n", cypher)

	neoQuery := neo.NewQuery(neo.Statement{string(cypher), nil})
	response, err := neoQuery.Run()
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(mustFmtJson(response, &parser.MergeData))
})
