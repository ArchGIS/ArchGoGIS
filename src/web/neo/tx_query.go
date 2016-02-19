package neo

import (
	"echo"
)

func (my *TxQuery) Run() (*Response, error) {
	statements := my.builder.Bytes()
	echo.Info.Printf("%+v", string(statements))

	response, err := tryNewResponse(agent.Post(txEndpoint, statements))
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

func (my *TxQuery) Debug() string {
	return string(my.builder.Bytes())
}
