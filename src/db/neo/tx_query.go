package neo

func (my *TxQuery) Run() (*Response, error) {
	response, err := tryNewResponse(agent.Post(txEndpoint, my.batch.Bytes()))
	if err != nil {
		return nil, err
	}

	my.commitUrl = response.Commit

	return response, nil
}

func (my *TxQuery) Rollback() (*Response, error) {
	return tryNewResponse(agent.Delete(my.baseUrl(), nil))
}

func (my *TxQuery) Commit() (*Response, error) {
	return tryNewResponse(agent.Post(my.commitUrl, nil))
}

func (my *TxQuery) baseUrl() string {
	return my.commitUrl[:len(my.commitUrl)-len("/commit")]
}
