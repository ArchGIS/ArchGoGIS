package neo

import (
	"bytes"
)

func NewTxQuery(batch Batch) *TxQuery {
	return &TxQuery{Query: Query{batch}}
}

func (my *Batch) Add(body string, params map[string]string) {
	my.AddStatement(Statement{body, params})
}

func (my *Batch) AddStatement(stmt Statement) {
	my.Statements = append(my.Statements, stmt)
}

func (my *Batch) Bytes() []byte {
	var buf bytes.Buffer
	buf.WriteString(`{"statements":[`)

	for _, stmt := range my.Statements {
		if len(stmt.Params) == 0 {
			my.writeStatement(&buf, stmt.Body)
		} else {
			my.writeParametrizedStatement(&buf, stmt)
		}
	}
	buf.Truncate(buf.Len() - 1) // Отбрасываем лишнюю запятую

	buf.WriteString(`]}`)

	return buf.Bytes()
}

func (my *Batch) writeStatement(buf *bytes.Buffer, body string) {
	buf.WriteString(`{"statement":"` + body + `"},`)
}

func (my *Batch) writeParametrizedStatement(buf *bytes.Buffer, stmt Statement) {
	buf.WriteString(`{"statement":"` + stmt.Body + `","parameters":{`)

	for key, val := range stmt.Params {
		buf.WriteString(`"` + key + `":` + val + `,`)
	}
	buf.Truncate(buf.Len() - 1) // Отбрасываем лишнюю запятую

	buf.WriteString(`}},`)
}
