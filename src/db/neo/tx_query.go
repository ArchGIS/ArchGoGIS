package neo

import (
	"echo"
	"errors"
)

func (my *TxQuery) firstRun() (*Response, error) {
	resp, err := tryNewResponse(agent.Post(txEndpoint, my.batch.Bytes()))
	if err != nil {
		return nil, err
	}

	my.commitUrl = resp.Commit
	my.baseUrl = my.commitUrl[:len(my.commitUrl)-len("/commit")]

	return resp, nil
}

func (my *TxQuery) run() (*Response, error) {
	resp, err := tryNewResponse(agent.Post(my.baseUrl, my.batch.Bytes()))
	if err != nil {
		my.Rollback()
		return nil, err
	}

	return resp, nil
}

func (my *TxQuery) Run() (*Response, error) {
	if my.commitUrl == "" {
		return my.firstRun()
	} else {
		return my.run()
	}
}

func (my *TxQuery) Rollback() (*Response, error) {
	if my.commitUrl == "" {
		return nil, errors.New("can not rollback prior any executions")
	}

	return tryNewResponse(agent.Delete(my.baseUrl, nil))
}

func (my *TxQuery) Commit() (*Response, error) {
	if my.commitUrl == "" {
		return nil, errors.New("can not commit prior any executions")
	}

	return tryNewResponse(agent.Post(my.commitUrl, nil))
}
