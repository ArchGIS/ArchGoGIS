package read2

import (
	"db/neo"
	"encoding/json"
	"fmt"
	"net/http"
	"service/hquery/read2/parser"
	"throw"
	"web"
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

	w.Write(mustFmtJson(response, &parser.MergeData))
}
