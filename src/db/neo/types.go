package neo

import (
	"encoding/json"
)

type Params map[string]string

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
	batch Batch
}

// Транзакции нужно закрывать всегда (Commit или Rollback)
type TxQuery struct {
	Query
	commitUrl string
	baseUrl   string
}

type Statement struct {
	Body   string
	Params Params
}

type Batch struct {
	Statements []Statement
}
