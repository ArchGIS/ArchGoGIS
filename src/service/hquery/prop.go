package hquery

import (
	"strings"
)

func newProp(key, val string) (*prop, error) {
	parts := strings.Split(key, "/") // [name, typeHint]

	// len(parts) должно быть равно 2
	if len(parts) < 2 {
		return nil, noTypeHintErr()
	} else if len(parts) > 2 {
		return nil, multipleSlashesErr()
	}

	switch parts[1] {
	case "number":
		return &prop{parts[0], val}, nil
	case "text":
		return &prop{parts[0], `"` + val + `"`}, nil
	default:
		return nil, badTypeHintErr(parts[1])
	}
}
