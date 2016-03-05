package main

import (
	"assert"
	"db/neo"
	"fmt"
	"service/hquery/format"
)

func main() {
	query := neo.Query{}
	/*
		stmt := neo.Statement{"match (a:Node {id:{id}}) return a", nil}
		for _, id := range []string{"1", "2"} {
			stmt.Params = map[string]string{"id": id}
			query.AddStatement(stmt)
		}
	*/

	cypher := `MATCH (f:Foo) MATCH (b:Bar) MATCH (f)-[:Bazd]->(b) RETURN COLLECT(b) AS bs, f`

	query.AddStatement(neo.Statement{cypher, nil})

	resp, err := query.Run()
	assert.Nil(err)

	// fmt.Printf("%s\n", string(resp.JsonBytes()))
	fmt.Printf("%s\n", string(format.NewJsonFormatter(resp).Bytes()))
}
