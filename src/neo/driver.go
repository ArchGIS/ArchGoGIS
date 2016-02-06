package neo

import (
	"req"
)

var (
	conn *req.Connection

	endpoint = "http://localhost:7474/db/data/transaction/commit/"
)

func init() {
	conn = req.NewConnection([]req.HeaderLine{
		{"Content-type", "application/json"},
		{"Accept", "application/json; charset=UTF-8"},
		{"Authorization", "Basic bmVvNGo6cXdlcnR56"},
	})
}

func BatchQuery(queries []string) ([]byte, error) {
	var statements = []byte(`{"statements":[`)

	for i := range queries {
		statements = append(statements, []byte(`{"statement": "`)...)
		statements = append(statements, []byte(queries[i])...)
		statements = append(statements, []byte(`"},`)...)
	}

	statements = append(statements[:len(statements)-1], []byte(`]}`)...)

	return conn.Post(endpoint, statements)
}
