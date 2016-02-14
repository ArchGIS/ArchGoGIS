package main

import (
	"assert"
	"fmt"
	"web/neo"
)

func main() {
	obj, err := neo.SimpleQuery(
		"match (x:Foo) return x",
		/*
			"create (x:Foo id:99, name: 'labo'})",
			"create (x:Foo {id:100, name: buggo'})",
		*/
	)
	assert.Nil(err)

	fmt.Printf("\n%+v\n", obj)
	println(len(obj.Errors))
}
