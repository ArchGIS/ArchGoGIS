package neo

func Run(body string, params Params) (*Response, error) {
	query := NewQuery(Statement{body, params})
	return query.Run()
}
