package api

const NoError = `{"error":false}`

func InternalServerError() string {
	return `{"error":1}`
}

func Error(err error) string {
	return `{"error":` + err.Error() + `}`
}
