package errs

import (
	"errors"
)

// Ошибки предварительной обработки
var (
	BadJsonGiven   = errors.New("1000")
	TooManyEntries = errors.New("1001")
	EmptyInput     = errors.New("1002")

	EntryTooManyProps = errors.New("1100")
	EntryNoProps      = errors.New("1101")

	TagTooLong = errors.New("1200")

	BatchTooManyProps = errors.New("1300")
)

// Ошибки разбора запроса
var (
	InvalidIdentifier = errors.New("2100")

	TagLabelMissing   = errors.New("2200")
	TagMultipleArrows = errors.New("2201")

	PropNoTypeHint      = errors.New("2300")
	PropInvalidKey      = errors.New("2301")
	PropUnknownTypeHint = errors.New("2302")
	PropInvalidNumber   = errors.New("2303")
	PropTextTooLong     = errors.New("2304")

	EdgeTooManyLabels = errors.New("2400")
	EdgeMissingRef    = errors.New("2401")
)

// Ошибки во время выполнения запроса
var (
	BatchUpdateFailed = errors.New("3000")
	BatchInsertFailed = errors.New("3001")
)
