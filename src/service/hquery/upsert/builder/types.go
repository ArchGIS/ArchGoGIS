package builder

import (
	"bytes"
)

type StatementBuilder struct {
	paramIndex int
	buf        bytes.Buffer
	params     map[string]string
}
