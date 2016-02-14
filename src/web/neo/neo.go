package neo

func SimpleQuery(statements ...string) (*SimpleResponse, error) {
	return simpleResponse(Exec(statements...))
}

func Exec(statements ...string) ([]byte, error) {
	builder := NewBuilder()
	for i := range statements {
		builder.AddStatement(statements[i])
	}

	return agent.Post(endpoint, builder.Bytes())
}

func SimpleQueryMap(statements map[string]string) (*SimpleResponse, error) {
	return simpleResponse(ExecMap(statements))
}

func ExecMap(statements map[string]string) ([]byte, error) {
	builder := NewBuilder()
	for _, statement := range statements {
		builder.AddStatement(statement)
	}

	return agent.Post(endpoint, builder.Bytes())
}

func simpleResponse(dbResponse []byte, err error) (*SimpleResponse, error) {
	if err == nil {
		return NewSimpleResponse(dbResponse)
	} else {
		return nil, err
	}
}
