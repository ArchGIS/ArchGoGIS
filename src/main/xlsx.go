package main

import (
	"conv/xl"
	"fmt"
)

func main() {
	format := []byte(`["Столбец1","Столбец2","Столбец3"]`)
	result, err := xl.ToJson("/home/quasilyte/DML/import_xslx/input/simple.xlsx", format)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%+v\n", string(result))
}
