package neo

import (
	"assert"
	"dbg"
	"testing"
)

var updates = []string{
	"MATCH (m:Monument {id: 10}) RETURN m",
	"MATCH (m:Monument {id: 11}) RETURN m",
}

func TestTxUpdates(t *testing.T) {
	tx := NewTxQuery()
	for _, statement := range updates {
		tx.AddStatement(statement)
	}

	result, err := tx.Run()
	assert.Nil(err)

	dbg.Dump(result)
	dbg.DumpSome(tx.Commit())

	/*
		for _, row := range result.Rows() {
			if len(row.Data) == 0 {
				tx.Rollback()
				panic("not updated")
			}
		}

		tx.Commit()
	*/
}

func TestQuery(t *testing.T) {
	q := NewQuery()
	for _, statement := range updates {
		q.AddStatement(statement)
	}

	result, err := q.Run()
	assert.Nil(err)

	dbg.Dump(result)
}
