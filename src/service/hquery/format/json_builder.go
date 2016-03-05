package format

import (
	"bytes"
	"db/neo"
	"echo"
)

type JsonFormatter struct {
	resp *neo.Response
}

func NewJsonFormatter(resp *neo.Response) *JsonFormatter {
	// Если хотя бы одна из двух проверок сработает, то это означает
	// некорректное формирование запросов в hquery билдерах.
	// Возможно тут стоит поставить assert'ы вместо текущих fatalf

	if len(resp.Results) != 1 {
		echo.ServerError.Fatalf(
			"hquery len(results) != 1, dump: %+v",
			resp.Results,
		)
	}

	// #FIXME: как нам возвращать пустой результат? Годится ли "{}"?
	if len(resp.Results[0].Data) == 0 {
		return &JsonFormatter{resp: nil}
	}

	if len(resp.Results[0].Data) != 1 {
		echo.ServerError.Fatalf(
			"hquery len(results[0].Data) != 1, dump: %+v",
			resp.Results[0].Data,
		)
	}

	return &JsonFormatter{resp: resp}
}

func (my *JsonFormatter) Bytes() []byte {
	if my.resp == nil {
		return []byte("{}")
	}

	var buf bytes.Buffer

	result := my.resp.Results[0]
	buf.WriteByte('{')
	for i, row := range result.Data[0].Row {
		buf.WriteString(`"` + result.Columns[i] + `":`)
		buf.Write(row)
		buf.WriteByte(',')
	}
	buf.Truncate(buf.Len() - 1)
	buf.WriteByte('}')

	return buf.Bytes()
}
