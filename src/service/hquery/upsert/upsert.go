package upsert

import (
	"db/neo"
	"fmt"
	"io"
	"net/http"
	"service/hquery/errs"
	// "strings"
	// "dbg"
	"service/hquery/upsert/ast"
	"service/hquery/upsert/builder"
	"web"
	"web/api"
)

var idSequences = map[string]string{
	"Monument":     "n_monument_id_seq",
	"Research":     "n_research_id_seq",
	"Describes":    "e_describes_id_seq",
	"Node1":        "1",
	"Node2":        "2",
	"Node3":        "3",
	"SomeRelation": "8",
}

func Handler(w web.ResponseWriter, r *http.Request) {
	response := processRequest(r.Body)
	fmt.Fprintf(w, "%s", response)
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
			return api.Error(errs.BatchUpdateFailed)
		}

		// Все ли записи были обновлены?
		for _, result := range resp.Results {
			if len(result.Data) == 0 {
				return api.Error(errs.BatchUpdateFailed)
			}
		}
	}

	if data.insertSize() > 0 {
		tx.SetBatch(makeInsertBatch(data))

		_, err := tx.Run()
		if err != nil {
			return api.Error(errs.BatchInsertFailed)
		}
	}

	tx.Commit()

	return api.NoError
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

	for _, edge := range data.edgeUpdates {
		batch.Add(builder.UpdateEdge(edge), propsToParams(edge.Props))
	}

	return batch
}

func makeInsertBatch(data *Data) neo.Batch {
	sb := builder.NewStatementBuilder(data.insertSize())

	for _, edge := range data.edgeInserts {
		if _, ok := data.nodeInserts[edge.Lhs]; !ok {
			node := data.nodeUpdates[edge.Lhs]
			sb.AddRef(getId(node.Props), node)
		} else if _, ok := data.nodeInserts[edge.Rhs]; !ok {
			node := data.nodeUpdates[edge.Rhs]
			sb.AddRef(getId(node.Props), node)
		}
	}

	for _, node := range data.nodeInserts {
		sb.AddNode(idSequences[node.Labels], node)
	}

	for _, edge := range data.edgeInserts {
		sb.AddEdge(idSequences[edge.Label], edge)
	}

	return neo.Batch{[]neo.Statement{sb.Build()}}
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
