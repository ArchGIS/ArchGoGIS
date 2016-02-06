package web

import (
	"echo"
	"net/http"
)

type ResponseWriter struct {
	http.ResponseWriter
}

func (rw *ResponseWriter) RenderError(code int) {
	message := http.StatusText(code)

	if message == "" {
		echo.ServerError.Printf("%d is not a valid http status code", code)

		// Выдадим 500-ую, если нам больше "нечего сказать"
		rw.RenderError(500)
	} else {
		http.Error(rw, message, code)
	}
}
