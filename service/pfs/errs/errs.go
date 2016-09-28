package errs

import (
	"errors"
)

var (
	SaveFileDataError = errors.New("1000")
	SaveServerError   = errors.New("1001")

	LoadServerError = errors.New("2000")

	UrlNoKey    = errors.New("3000")
	UrlNotFound = errors.New("3001")
)
