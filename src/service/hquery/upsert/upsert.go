package upsert

import (
	"cfg"
	"db/neo"
	"db/pg/seq"
	"echo"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/upsert/ast"
	"service/hquery/upsert/builder"
	"web"
	"web/api"
)

func Handler(w web.ResponseWriter, r *http.Request) {
	if r.ContentLength > cfg.HqueryUpsertMaxInputLen {
		fmt.Fprint(w, api.Error(errs.InputIsTooBig))
	}

	response := processRequest(r.Body)
	fmt.Fprint(w, response)
}

func processRequest(input io.ReadCloser) string {
	data, err := parse(input)
	if err != nil {
		return api.Error(err)
	}

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
			if err != nil {
				return api.Error(errs.BatchInsertFailed)
			}
			ids[node.Name] = id
		}

		batch, err := makeInsertBatch(ids, data)
		if err != nil {
			echo.ServerError.Print(err)
			return api.Error(errs.BatchInsertFailed)
		}

		tx.SetBatch(*batch)

		_, err = tx.Run()
		if err != nil {
			return api.Error(errs.BatchInsertFailed)
		}
	}

	tx.Commit()
	jsonString, err := json.Marshal(ids)

	return string(jsonString)
}

func parse(input io.ReadCloser) (*Data, error) {
	parser, err := NewParser(input)
	if err != nil {
		return nil, err
	}

	err = parser.parse()
	if err != nil {
		return nil, err
	}

	return &parser.Data, nil
}

// #FIXME: этой функции может и не быть, если props будут хранится в виде
// map[string]string. Когда-то здесь был unsafe трюк (cast), но он работал до
// переписывания params на map[string]string.
func propsToParams(props []*ast.Prop) map[string]string {
	params := make(map[string]string, len(props))

	for _, prop := range props {
		params[prop.Key] = prop.Val
	}

	return params
}

func makeUpdateBatch(data *Data) neo.Batch {
	batch := neo.Batch{
		make([]neo.Statement, 0, data.updateSize()),
	}

	for _, node := range data.nodeUpdates {
		batch.Add(builder.UpdateNode(node), propsToParams(node.Props))
	}

	return batch
}

func makeInsertBatch(ids map[string]string, data *Data) (*neo.Batch, error) {
	sb := builder.NewStatementBuilder(data.insertSize())

	// Собрать MATCH для отсутствующих в insert связей.
	for _, edge := range data.edges {
		if _, ok := data.nodeInserts[edge.Lhs]; !ok {
			node := data.nodeUpdates[edge.Lhs]
			sb.AddRef(getId(node.Props), node)
		} else if _, ok := data.nodeInserts[edge.Rhs]; !ok {
			node := data.nodeUpdates[edge.Rhs]
			sb.AddRef(getId(node.Props), node)
		}
	}

	for _, node := range data.nodeInserts {
		sb.AddNode(ids[node.Name], node)
	}

	for _, edge := range data.edges {
		sb.AddEdge(edge)
	}

	return &neo.Batch{[]neo.Statement{sb.Build()}}, nil
}

// #FIXME: функция перестанет быть нужной как только []*Prop будет
// переписан на map[string]string.
func getId(props []*ast.Prop) string {
	for _, prop := range props {
		if prop.Key == "id" {
			return prop.Val
		}
	}

	panic("refactor []*ast.Prop to map[string]string!")
}
