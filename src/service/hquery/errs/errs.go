package errs

import (
	"errors"
)

// Ошибки разбора запроса
var (
	LabelMissing         = errors.New("1000")
	MultipleArrows       = errors.New("1001")
	LongDescriptorString = errors.New("1003")
	NoPropTypeHint       = errors.New("2000")
	BadPropTypeHint      = errors.New("2001")
	InvalidPropKey       = errors.New("2002")
	MissingRefs          = errors.New("3000")
	BatchUpdateFailed    = errors.New("4000")
	NotAllRecordsUpdates = errors.New("4001")
)
