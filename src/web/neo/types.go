package neo

import (
	"bytes"
	"encoding/json"
)

// Builder - одноразовый(!) генератор запросов.
type Builder struct {
	query bytes.Buffer
}

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

// SimpleResponse - ответ без статистики и состояния коммита.
// Такой ответ приходит в случае использования анонимной транзакции.
type SimpleResponse struct {
	Results []Result
	Errors  []Error
}

func NewSimpleResponse(input []byte) (*SimpleResponse, error) {
	result := &SimpleResponse{}
	err := json.Unmarshal(input, result)

	return result, err
}

func NewBuilder() *Builder {
	query := bytes.Buffer{}
	query.WriteString(`{"statements":[`)

	return &Builder{query}
}
