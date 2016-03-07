package errs

import (
	"errors"
)

var (
	FilterIsEmpty = errors.New("1000")

	PrefixIsTooShort = errors.New("1100")
	PrefixIsTooLong  = errors.New("1101")
)

var (
	RetrieveError = errors.New("2000")
)
