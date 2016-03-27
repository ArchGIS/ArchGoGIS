package read2

import (
	"assert"
	"db/neo"
	"encoding/json"
	"ext"
	"ext/xjson"
	"ext/xslice"
	"fmt"
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

func mustFmtJson(resp *neo.Response, merges *mergeData) []byte {
	var result ext.Xbuf
	cols, row := mustDestructureResp(resp)

	if len(resp.Results[0].Data) == 0 {
		return []byte("{}")
	}

	result.WriteByte('{')
	for colIndex, rowData := range row {
		colName := cols[colIndex]

		if to := merges.mapping[colName]; to != "" {
			fmt.Printf("%+v\n", string(row[xslice.IndexString(cols, colName)]))

			mergeFrom := xjson.MustDecode(row[xslice.IndexString(cols, colName)])
			mergeInto := xjson.MustDecode(row[xslice.IndexString(cols, to)])
			merged := xjson.MustEncode(xjson.Merge(mergeFrom, mergeInto))

			result.WriteStringf(`"%s":%s,`, to, string(merged))
		} else if !merges.isMerging(colName) {
			result.WriteStringf(`"%s":%s,`, colName, string(rowData))
		}
	}
	result.DropLastByte()
	result.WriteByte('}')

	return result.Bytes()
}
