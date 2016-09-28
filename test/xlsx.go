package test

import (
	"github.com/ArchGIS/ArchGoGIS/conv/xl"
	"fmt"
)

func main() {
	format := []byte(`["Номер","Название памятника","X","Y","Тип памятника","Культура","Эпоха","Описание","Библиографическая ссылка","Страница"]`)

	result, err := xl.ToJson("D:/Educations/test.xlsx", format)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%+v\n", string(result))
}
