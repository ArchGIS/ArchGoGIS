package main

import (
	"assert"
	"db/pg/seq"
	"fmt"
)

func main() {
	ids, err := seq.NextIds("Monument", 4)
	assert.Nil(err)
	fmt.Printf("%+v\n", ids)
}
