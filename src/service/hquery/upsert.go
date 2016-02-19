package hquery

import (
	"dbg"
	"fmt"
	"io"
	"net/http"
	"service/hquery/errs"
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
	for _, statement := range parser.updates {
		tx.AddStatement(statement)
	}
	resp, err := tx.Run()
	if err != nil {
		return api.Error(errs.BatchUpdateFailed)
	}

	// Все ли записи были обновлены?
	for _, result := range resp.Results {
		if len(result.Data) == 0 { // Одна или более записей не были обновлены
			tx.Rollback()
			return api.Error(errs.NotAllRecordsUpdates)
		}
	}

	tx.Rollback() // Потом здесь будет Commit()

	return api.NoError
}
