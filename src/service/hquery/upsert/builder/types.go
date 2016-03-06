package builder

import (
	"ext"
	"service/hquery/placeholder"
)

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	params      map[string]string
}
