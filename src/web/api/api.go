package api

const NoError = `{"error":false}`

func InternalServerError() string {
	return `{"error":"internal server error"}`
}

func Error(err error) string {
	return `{"error":` + err.Error() + `}`
}
