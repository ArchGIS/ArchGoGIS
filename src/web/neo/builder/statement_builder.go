package builder

import (
	"ext/xstr"
)

func (my *StatementBuilder) AddString(part string) {
	my.statement.WriteString(part)
}

func (my *StatementBuilder) AddStrings(parts []string) {
	my.statement.Grow(xstr.Len(parts))
	xstr.Write(my.statement, parts)
}

func (my *StatementBuilder) AddStringsMap(parts map[string]string) {
	my.statement.Grow(xstr.LenMap(parts))
	xstr.WriteMap(my.statement, parts)
}

func (my *StatementBuilder) Bytes() []byte {
	return my.statement.Bytes()
}
