package neo

import (
	"encoding/json"
	"web/neo/builder"
)

type Result struct {
	Columns []string
	Data    []struct {
		Row []json.RawMessage
	}
}

type Error struct {
	Code    string
	Message string
}

type Response struct {
	Commit  string
	Results []Result
	Errors  []Error
}

type Query struct {
	builder *builder.Builder
}

type TxQuery struct {
	Query
	commitUrl string
}

func NewQuery() Query {
	return Query{builder.New()}
}

func NewTxQuery() TxQuery {
	return TxQuery{NewQuery(), ""}
}

func newResponse(input []byte) (*Response, error) {
	result := &Response{}
	err := json.Unmarshal(input, result)

	return result, err
}

func tryNewResponse(responseText []byte, err error) (*Response, error) {
	if err == nil {
		return newResponse(responseText)
	} else {
		return nil, err
	}
}
