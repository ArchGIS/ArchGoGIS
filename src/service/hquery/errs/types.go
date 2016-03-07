package errs

type HqueryError struct {
	msg string
}

func (my HqueryError) Error() string {
	return my.msg
}
