package web

import (
	"echo"
	"net/http"
)

type Route struct {
	Pattern string
	Handler HandlerFunc
}

func Serve(port string, routes []Route) {
	// Расставить handler-функции по роутингу
	for i := range routes {
		handleFunc(routes[i].Pattern, routes[i].Handler)
	}

	// Запустить прослушивание входящих соединений
	echo.Info.Printf("starting server at :%s port", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		echo.ServerError.Print(err)
	}
}
