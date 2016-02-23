package upsert

import (
	"cfg"
	"service/hquery/errs"
)

func inputError(tag string, rawProps map[string]string) error {
	if len(rawProps) > cfg.HqueryMaxPropsPerEntry {
		return errs.EntryTooManyProps
	}

	if len(rawProps) == 0 {
		return errs.EntryNoProps
	}

	if len(tag) > cfg.HqueryMaxTagLen {
		return errs.TagTooLong
	}

	return nil
}
