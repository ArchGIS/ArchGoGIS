package builder

import (
	"bytes"
)

func (my *QueryBuilder) AddStatement(statement string) {
	my.statements = append(my.statements, statement)
}

func (my *QueryBuilder) Bytes() []byte {
	result := bytes.Buffer{}
	result.WriteString(`{"statements":[`)

	for _, statement := range my.statements {
		result.WriteString(`{"statement":"` + statement + `"},`)
	}

	result.Truncate(result.Len() - 1) // Отбрасываем лишнюю запятую
	result.WriteString(`]}`)

	return result.Bytes()
}
