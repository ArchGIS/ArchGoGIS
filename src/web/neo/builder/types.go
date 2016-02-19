package builder

import (
	"bytes"
)

type QueryBuilder struct {
	statements []string
}

// Пока не используется (возможно скоро будет удалён)
type StatementBuilder struct {
	statement *bytes.Buffer
}

func NewQueryBuilder() *QueryBuilder {
	return &QueryBuilder{}
}
