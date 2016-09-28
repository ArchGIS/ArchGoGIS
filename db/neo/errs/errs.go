package errs

import (
	"errors"
)

var (
	InvalidResponse = errors.New("response is invalid due to execution errors")
)
