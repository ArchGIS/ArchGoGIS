package errs

import (
	"errors"
)

func IdSeqNotFound(tableName string) error {
	return errors.New("id sequence for " + tableName + " not found")
}
