package hquery

import (
	"fmt"
	"io"
	"net/http"
	"service/hquery/errs"
	"strings"
	"web"
	"web/api"
	"web/neo"
)

func Upsert(w web.ResponseWriter, r *http.Request) {
	response := processRequest(r.Body)
	fmt.Fprintf(w, "%s", response)
}

func processRequest(input io.ReadCloser) string {
	parser, err := newUpsertParser(input)
	if err != nil {
		return api.Error(err)
	}

	err = parser.parse()
	if err != nil {
		return api.Error(err)
	}

	tx := neo.NewTxQuery()
	parts := []string{}

	// #FIXME: нужно переписать. Выносить в parser - не вариант.
	for _, relation := range parser.relations {
		if _, hasLhs := parser.inserts[relation.BinOp.Lhs]; !hasLhs {
			update := parser.updates[relation.BinOp.Lhs]
			parts = append(parts, update[:strings.IndexByte(update, '\n')])
		}
		if _, hasRhs := parser.inserts[relation.BinOp.Rhs]; !hasRhs {
			update := parser.updates[relation.BinOp.Rhs]
			parts = append(parts, update[:strings.IndexByte(update, '\n')])
		}
	}

	for _, insert := range parser.inserts {
		parts = append(parts, insert)
	}
	for _, relation := range parser.relations {
		parts = append(parts, relation.statement)
	}

	tx.AddStatement(strings.Join(parts, "\n"))
	response, err := tx.Run()
	if err != nil || len(response.Errors) != 0 {
		tx.Rollback()
		return api.Error(errs.BatchInsertFailed)
	}
	response, err = tx.Commit() // #FIXME: нужно проверять сразу 2 ошибки. Из net и из neo
	if err != nil || len(response.Errors) != 0 {
		return api.Error(errs.BatchInsertFailed)
	}

	return api.NoError
}
