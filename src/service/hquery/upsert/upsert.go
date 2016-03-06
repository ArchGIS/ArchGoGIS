package upsert

import (
	"db/neo"
	"db/pg/seq"
	"echo"
	"encoding/json"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/shared"
	"service/hquery/upsert/builder"
	"throw"
	"web"
	"web/api"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	shared.Handle(w, r, processRequest)
}

func processRequest(input io.ReadCloser) []byte {
	data := mustParse(input)

	var tx neo.TxQuery

	if data.updateSize() > 0 {
		tx.SetBatch(makeUpdateBatch(data))

		resp, err := tx.Run()
		if err != nil {
			tx.Rollback()
			return api.Error(errs.BatchUpdateFailed)
		}

		// Все ли записи были обновлены?
		for _, result := range resp.Results {
			if len(result.Data) == 0 {
				return api.Error(errs.BatchUpdateFailed)
			}
		}
	}

	var ids map[string]string

	if data.insertSize() > 0 {
		ids = make(map[string]string, len(data.nodeInserts))
		for _, node := range data.nodeInserts {
			id, err := seq.NextId(node.Labels)
			throw.Guard(err, func(err error) {
				echo.ServerError.Print(err)
				throw.Error(errs.BatchInsertFailed)
			})
			ids[node.Name] = id
		}

		tx.SetBatch(makeInsertBatch(ids, data))

		_, err := tx.Run()
		if err != nil {
			return api.Error(errs.BatchInsertFailed)
		}
	}

	tx.Commit()
	jsonString, err := json.Marshal(ids)
	if err != nil {
		panic(err)
	}

	return jsonString
}

func mustParse(input io.ReadCloser) *Data {
	parser := MustNewParser(input)

	parser.mustParse()

	return &parser.Data
}

func makeUpdateBatch(data *Data) neo.Batch {
	batch := neo.Batch{
		make([]neo.Statement, 0, data.updateSize()),
	}

	for _, node := range data.nodeUpdates {
		batch.Add(builder.UpdateNode(node), node.Props)
	}

	return batch
}

func makeInsertBatch(ids map[string]string, data *Data) neo.Batch {
	sb := builder.NewStatementBuilder(data.insertSize())

	// Собрать MATCH для отсутствующих в insert связей.
	for _, edge := range data.edges {
		if _, ok := data.nodeInserts[edge.Lhs]; !ok {
			node := data.nodeUpdates[edge.Lhs]
			sb.AddRef(node.Props["id"], node)
		} else if _, ok := data.nodeInserts[edge.Rhs]; !ok {
			node := data.nodeUpdates[edge.Rhs]
			sb.AddRef(node.Props["id"], node)
		}
	}

	for _, node := range data.nodeInserts {
		sb.AddNode(ids[node.Name], node)
	}

	for _, edge := range data.edges {
		sb.AddEdge(edge)
	}

	return neo.Batch{[]neo.Statement{sb.Build()}}
}
