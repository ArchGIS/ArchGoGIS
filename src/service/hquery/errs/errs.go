package errs

// Ошибки предварительной обработки
var (
	BadJsonGiven       = &HqueryError{"1000"}
	TooManyEntries     = &HqueryError{"1001"}
	EmptyInput         = &HqueryError{"1002"}
	InputIsTooBig      = &HqueryError{"1003"}
	LimitParamOverflow = &HqueryError{"1004"}

	EntryTooManyProps = &HqueryError{"1100"}

	TagTooLong = &HqueryError{"1200"}

	BatchTooManyProps = &HqueryError{"1300"}
)

// Ошибки разбора запроса
var (
	InvalidIdentifier = &HqueryError{"2100"}

	TagLabelMissing = &HqueryError{"2200"}
	TagBadFormat    = &HqueryError{"2201"}

	PropNoTypeHint      = &HqueryError{"2300"}
	PropInvalidKey      = &HqueryError{"2301"}
	PropUnknownTypeHint = &HqueryError{"2302"}
	PropInvalidNumber   = &HqueryError{"2303"}
	PropTextTooLong     = &HqueryError{"2304"}

	NodeNoProps = &HqueryError{"2400"}

	EdgeTooManyLabels  = &HqueryError{"2500"}
	EdgeMissingRef     = &HqueryError{"2501"}
	EdgeSlotsBadFormat = &HqueryError{"2502"}

	QueryBadFormat   = &HqueryError{"2600"}
	QueryNoMatcher   = &HqueryError{"2601"}
	QueryBadMatcher  = &HqueryError{"2602"}
	QueryBadSelector = &HqueryError{"2603"}

	ValidationNoValue = &HqueryError{"2700"}
	ValidationFailed  = &HqueryError{"2701"}
)

// Ошибки во время выполнения запроса
var (
	BatchUpdateFailed = &HqueryError{"3000"}
	BatchInsertFailed = &HqueryError{"3001"}
	BatchReadFailed   = &HqueryError{"3002"}
)
