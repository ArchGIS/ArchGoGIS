package test

import (
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"encoding/json"
	"fmt"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read2"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/read2/parser"
)

func main() {
	/*
		rawQuery := []byte(`{
			"r:Research.getBy": 10,
			"a:Author.getBy": "r",
			"coa:Coauthor.getBy": "r",
			"k:Knowledge.getBy": "r",
			"m:Monument.getBy": "k",
			"d:Document.getBy": "k",
			"p:Photo.getBy": "k"
		}`)
	*/

	rawQuery := []byte(`{
		"a:Author.getBy": 697622,
		"o:Organization.mergeBy": "a"
	}`)

	/*
		rawQuery = []byte(`{
			"o:Organization.getBy": 1,
			"a:Author.mergeBy": "o"
		}`)
	*/

	var query map[string]interface{}
	json.Unmarshal(rawQuery, &query)

	parser := parser.New(query)

	cypher := parser.GenerateCypher()
	fmt.Printf("`%s`\n", string(cypher))

	fmt.Printf("%+v\n", parser.MergeData)

	resp, err := neo.Run(string(cypher), nil)
	if err != nil {
		panic(err)
	}

	result := read2.MustFmtJson(resp, &parser.MergeData)
	fmt.Printf("`%s`\n", string(result))
}
