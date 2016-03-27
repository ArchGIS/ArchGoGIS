package read2

import (
	"db/neo"
	"encoding/json"
	"fmt"
	"net/http"
	"service/hquery/read2/parser"
	"web"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	var query map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&query)

	parser := parser.New(query)
	cypher := parser.GenerateCypher()

	neoQuery := neo.NewQuery(neo.Statement{string(cypher), nil})
	response, err := neoQuery.Run()
	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v\n", response)
	w.Write(mustFmtJson(response, &parser.MergeData))

	/*
		limit := r.URL.Query().Get("limit")
		if xstr.NumericalGt(limit, cfg.HqueryReadMaxLimit) {
			w.Write(api.Error(errs.LimitParamOverflow))
		} else {
			if limit == "" {
				limit = cfg.HqueryReadDefaultLimit
			}

			shared.Handle(w, r, func(input io.ReadCloser) []byte {
				return mustProcessRequest(input, limit)
			})
		}
	*/
}
