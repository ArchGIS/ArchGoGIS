package web

type Route struct {
	Pattern string
	Handler HandlerFunc
}
