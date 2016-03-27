package main

import (
	"db/neo"
	"service/hquery/read2"
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

	parser := read2.NewParser(query)

	cypher := parser.generateCypher()
	fmt.Printf("%+v\n", string(cypher))

	neoQuery := neo.NewQuery(neo.Statement{string(cypher), nil})
	response, err := neoQuery.Run()
	if err != nil {
		panic(err)
	}

	result := read2.MustJsonFmt(resp)

	fmt.Printf("`%s`\n", string(formatResponse(response, &parser.mergeData)))
}
