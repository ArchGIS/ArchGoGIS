package hquery

import (
	"encoding/json"
	"io"
	// "service/hquery/stmt"
	"service/hquery/ast"
)

type entry map[string]string
type entries map[string]entry

type relation struct {
	*ast.BinOp
	query string
}

type UpsertParser struct {
	entries   entries
	updates   map[string]string
	inserts   map[string]string
	relations []*relation
}

func newUpsertParser(input io.ReadCloser) (*UpsertParser, error) {
	parser := &UpsertParser{} // Откладываем инициализацию map'ов
	err := json.NewDecoder(input).Decode(&parser.entries)

	if err == nil {
		// Производим аллокации только если успешно выполнился decode.
		// Выделяем [возможно] больше памяти, чем нужно, зато гарантированно
		// задаём максимально возможный capacity
		parser.updates = make(map[string]string, len(parser.entries))
		parser.inserts = make(map[string]string, len(parser.entries))
		return parser, nil
	} else {
		return nil, err
	}
}
