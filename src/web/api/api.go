package api

var noError []byte

func init() {
	noError = []byte(`{"error":false}`)
}

func NoError() []byte {
	return noError
}

func InternalServerError() []byte {
	return []byte(`{"error":1}`)
}

func Error(err error) []byte {
	errBytes := make([]byte, len(`{"error":`)+len(err.Error())+1)

	errBytes = append(errBytes, `{"error":`...)
	errBytes = append(errBytes, err.Error()...)
	errBytes = append(errBytes, '}')

	return errBytes
}
