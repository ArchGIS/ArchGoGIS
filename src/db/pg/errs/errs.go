package errs

import (
	"errors"
)

func IdSeqNotFound(tableName string) error {
	return "id sequence for " + tableName + " not found"
}
