package web

import (
	"echo"
	"net/http"
)

func (my *ResponseWriter) RenderError(code int) {
	message := http.StatusText(code)

	if message == "" {
		echo.ServerError.Printf("%d is not a valid http status code", code)

		// Выдадим 500-ую, если нам больше "нечего сказать"
		my.RenderError(500)
	} else {
		http.Error(my, message, code)
	}
}
