package xl

func toString(cell *xlsx.Cell) string {
	stringValue, err := cell.String()
	if err != nil {
		// Не знаю, что здесь за ошибка может быть, лень
		// смотреть исходники функции xlsx.Cell.String(). Возможно она всегда nil
		// ошибку возвращает. Это можно проверить как-нибудь потом.
		panic(err)
	}

	return stringValue
}

// Пример использования:
// func main() {
//   format := []byte(`["Столбец1","Столбец2","Столбец3"]`)
//   result, err := xlsxToJson("input/simple.xlsx", format)
//   if err != nil {
//     panic(err)
//   }
//   fmt.Printf("%+v\n", string(result))
// }
func ToJson(xlsxFilePath string, rawScheme []byte) ([]byte, error) {
	file, err := xlsx.OpenFile(xlsxFilePath)
	if err != nil {
		return nil, err
	}

	// Парсим JSON строку схемы.
	scheme := []string{}
	err = json.Unmarshal(rawScheme, &scheme)
	if err != nil {
		return nil, errors.New("invalid rawScheme: " + err.Error())
	}

	sheet := file.Sheets[0] // Работаем только с первым листом
	header := sheet.Rows[0] // Первый ряд - заголок
	rows := sheet.Rows[1:]  // Остальные - данные

	// Сбор индексов. Разрешены столбцы в любом порядке.
	result := NewResult(len(scheme), len(rows))
	for _, headerCell := range header.Cells {
		headerCellName := toString(headerCell)
		for _, schemeCellName := range scheme {
			if headerCellName == schemeCellName {
				result.Header = append(result.Header, headerCellName)
			}
		}
	}
	if len(result.Header) != len(scheme) {
		return nil, errors.New("given xlsx file not matches scheme")
	}

	for rowIndex, row := range rows {
		for _, cell := range row.Cells {
			result.Rows[rowIndex] =
				append(result.Rows[rowIndex], toString(cell))
		}
	}

	return json.Marshal(result)
}
