package errs

import (
	"errors"
)

// Ошибки предварительной обработки
var (
	BadJsonGiven       = errors.New("1000")
	TooManyEntries     = errors.New("1001")
	EmptyInput         = errors.New("1002")
	InputIsTooBig      = errors.New("1003")
	LimitParamOverflow = errors.New("1004")

	EntryTooManyProps = errors.New("1100")

	TagTooLong = errors.New("1200")

	BatchTooManyProps = errors.New("1300")
)

// Ошибки разбора запроса
var (
	InvalidIdentifier = errors.New("2100")

	TagLabelMissing = errors.New("2200")
	TagBadFormat    = errors.New("2201")

	PropNoTypeHint      = errors.New("2300")
	PropInvalidKey      = errors.New("2301")
	PropUnknownTypeHint = errors.New("2302")
	PropInvalidNumber   = errors.New("2303")
	PropTextTooLong     = errors.New("2304")

	NodeNoProps = errors.New("2400")

	EdgeTooManyLabels  = errors.New("2500")
	EdgeMissingRef     = errors.New("2501")
	EdgeSlotsBadFormat = errors.New("2502")

	QueryBadFormat   = errors.New("2600")
	QueryNoMatcher   = errors.New("2601")
	QueryBadMatcher  = errors.New("2602")
	QueryBadSelector = errors.New("2603")
)

// Ошибки во время выполнения запроса
var (
	BatchUpdateFailed = errors.New("3000")
	BatchInsertFailed = errors.New("3001")
	BatchReadFailed   = errors.New("3002")
)
