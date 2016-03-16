package delete

import (
	// "encoding/json"
	// "fmt"
	"io"
	"net/http"
	"service/hquery/errs"
	"service/hquery/parsing"
	"service/hquery/valid"
	"throw"
	"web"
)

/*
{
	"a:Author": {"id": "119",
}

{
  "Author": {
    "119": "*",
    "112": "*",
    "120": "name",
	"121": "val",
  },
  "Monument": {"10": "*"},
  "Research_Has_File": {"10_20":
  "Knowledge": {"10"}
}

MATCH (a:Author)
WHERE a.id IN [119, 112]
DELETE a
#
MATCH (a1:Author {id:120})
MATCH (a2:Author {id:121})
REMOVE a1.name, a2.val
#
MATCH (m:Monument)
WHERE m.id IN [10]
DELETE m

ast:
removes: [ Deleter{labels

заметки:
x.id IN [id...] лучше, чем x.id = 1 or x.id = 2 ...
без detach удаление будет быстрее
для props оператор удаления - remove
каждый "lables" должен идти в отдельном окне
индексы проще подцеплять если remove и delete выполняются раздельно
запретить удаление id
*/

type Parser struct {
	input   parsing.Tree
	deletes []parsing.Node
	removes []parsing.Node
}

func mustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	return this
}

func (my *Parser) mustParse() {
	for labels, pairs := range my.input {
		for id, selector := range pairs {
			throw.If(!valid.Number(id), errs.PropInvalidNumber)
			throw.If(selector != "*" && !valid.Identifier(selector), errs.QueryBadSelector)
		}
	}
}

func Handler(w web.ResponseWriter, r *http.Request) {
	// parser := mustNewParser(r.Body)
	// mustValidate(data)
}

func mustValidate(data parsing.Tree) {
	for labels, pairs := range data {
		throw.If(!valid.Identifier(labels), errs.InvalidIdentifier)
		for id, selector := range pairs {
			throw.If(!valid.Number(id), errs.PropInvalidNumber)
			throw.If(selector != "*" && !valid.Identifier(selector), errs.QueryBadSelector)
		}
	}
}
