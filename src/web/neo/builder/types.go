package builder

import (
	"bytes"
)

// Builder - одноразовый(!) генератор запросов.
type Builder struct {
	query bytes.Buffer
}

func New() *Builder {
	query := bytes.Buffer{}
	query.WriteString(`{"statements":[`)

	return &Builder{query}
}
