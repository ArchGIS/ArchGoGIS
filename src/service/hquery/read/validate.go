package read

import (
	"cfg"
	"service/hquery/errs"
)

// #FIXME: дублируется с upsert/validate.go#inpurError. Отличается только тип slots
func inputError(tag string, slots map[string]string) error {
	if len(slots) > cfg.HqueryMaxPropsPerEntry {
		return errs.EntryTooManyProps
	}

	if len(tag) > cfg.HqueryMaxTagLen {
		return errs.TagTooLong
	}

	return nil
}
