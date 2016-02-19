package xstr

import (
	"ext"
)

// Вот здесь хотелось бы иметь генерики или шаблоны...
// #FIXME: посмотреть в сторону `go generate`

func Len(parts []string) int {
	result := 0

	for _, part := range parts {
		result += len(part)
	}

	return result
}

func LenMap(parts map[string]string) int {
	result := 0

	for _, part := range parts {
		result += len(part)
	}

	return result
}

func WriteMap(w ext.StringWriter, parts map[string]string) {
	for _, part := range parts {
		w.WriteString(part)
	}
}

func Write(w ext.StringWriter, parts []string) {
	for _, part := range parts {
		w.WriteString(part)
	}
}
