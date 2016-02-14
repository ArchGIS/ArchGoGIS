package hquery

import (
	"encoding/json"
	"io"
	"service/hquery/stmt"
	"strings"
)

type UpsertEntry map[string]string
type UpsertBatch map[string]UpsertEntry

type UpdateMap map[string]stmt.Update
type InsertMap map[string]stmt.Insert

type prop struct {
	key string
	val string
}

type UpsertParser struct {
	batch     UpsertBatch
	updates   UpdateMap
	inserts   InsertMap
	relations []*stmt.Relation
}

func newProp(key, val string) (*prop, error) {
	parts := strings.Split(key, "/") // [name, typeHint]

	// len(parts) должно быть равно 2
	if len(parts) < 2 {
		return nil, noTypeHintErr()
	} else if len(parts) > 2 {
		return nil, multipleSlashesErr()
	}

	switch parts[1] {
	case "number":
		return &prop{parts[0], val}, nil
	case "text":
		return &prop{parts[0], `"` + val + `"`}, nil
	default:
		return nil, badTypeHintErr(parts[1])
	}
}

func newUpsertParser(input io.ReadCloser) (*UpsertParser, error) {
	parser := &UpsertParser{} // Откладываем инициализацию map'ов
	err := json.NewDecoder(input).Decode(&parser.batch)

	if err == nil {
		// Производим аллокации только если успешно выполнился decode.
		// Выделяем [возможно] больше памяти, чем нужно, зато гарантированно
		// задаём максимально возможный capacity
		parser.updates = make(UpdateMap, len(parser.batch))
		parser.inserts = make(InsertMap, len(parser.batch))
		return parser, nil
	} else {
		return nil, err
	}
}
