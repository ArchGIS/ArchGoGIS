package read2

import (
	"assert"
	"db/neo"
	"encoding/json"
	"ext"
	"ext/xjson"
	"ext/xslice"
	"service/hquery/read2/parser"
	"throw"
)

func mustDestructureResp(resp *neo.Response) ([]string, []json.RawMessage) {
	// Мы всегда применяем агрегацию для множественных результатов,
	// поэтому если эти assert'ы вызовут panic, то ошибка кроется в
	// генерации запросов к neo4j.
	assert.True(len(resp.Results) == 1)
	assert.True(len(resp.Results[0].Data) == 1)

	cols := resp.Results[0].Columns
	row := resp.Results[0].Data[0].Row

	return cols, row
}

// #FIXME
func mustFmtJson(resp *neo.Response, merges *parser.MergeData) []byte {
	if len(resp.Results[0].Data) == 0 {
		return []byte("{}")
	}

	var result ext.Xbuf
	cols, row := mustDestructureResp(resp)

	result.WriteByte('{')
	for colIndex, rowData := range row {
		colName := cols[colIndex]

		if to := merges.Mapping[colName]; to != "" {
			from := row[xslice.IndexString(cols, colName)]
			into := row[xslice.IndexString(cols, to)]

			if rowData[0] == '{' { // Одиночный объект
				mergeFrom := xjson.MustDecode(from)
				mergeInto := xjson.MustDecode(into)
				merged := xjson.MustEncode(xjson.Merge(mergeFrom, mergeInto))

				result.WriteStringf(`"%s":%s,`, to, string(merged))
			} else { // Массив объектов
				var mergesFrom []xjson.Object
				var mergesInto []xjson.Object

				throw.OnError(json.Unmarshal(from, &mergesFrom))
				throw.OnError(json.Unmarshal(into, &mergesInto))
				for i := range mergesFrom {
					mergesInto[i] = xjson.Merge(mergesFrom[i], mergesInto[i])
				}
				merged, err := json.Marshal(mergesInto)
				throw.OnError(err)

				result.WriteStringf(`"%s":%s,`, to, string(merged))

			}
		} else if !merges.IsMerging(colName) {
			result.WriteStringf(`"%s":%s,`, colName, string(rowData))
		}
	}
	result.DropLastByte()
	result.WriteByte('}')

	return result.Bytes()
}
