package main

import (
	"assert"
	"service/hquery/ast"
	"service/hquery/stmt"
	"strings"
)

func main() {
	descriptor, err := ast.NewDescriptor("foo:Bar")
	assert.Nil(err)

	statement, err := stmt.BuildUpdate(descriptor, map[string]string{
		"id":       "34",
		"x/number": "10",
		"y/number": "20",
	})
	assert.Nil(err)

	println(statement[:strings.IndexByte(statement, '\n')])
}
