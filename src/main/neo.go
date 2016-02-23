package main

import (
	"assert"
	"db/neo"
	"fmt"
)

func main() {
	query := neo.Query{}
	stmt := neo.Statement{"match (a:Node {id:{id}}) return a", nil}

	for _, id := range []string{"1", "2"} {
		stmt.Params = map[string]string{"id": id}
		query.AddStatement(stmt)
	}

	resp, err := query.Run()
	assert.Nil(err)

	fmt.Printf("%+v\n", resp)
}
