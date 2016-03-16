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
  "Author": {
    "119": "*",
    "112": "*",
    "120": "name"
  }
}

заметки:
x.id IN [id...] лучше, чем x.id = 1 or x.id = 2 ...
без detach удаление будет быстрее
для props оператор удаления - remove
каждый "lables" должен идти в отдельном окне

*/

type Parser struct {
	input parsing.Source
}

func mustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	return this
}

func (my *Parser) mustParse() {
	/*
		for labels, pairs := range my.input {
			for id, selector := range pairs {
				throw.If(!valid.Number(id), errs.PropInvalidNumber)
				throw.If(selector != "*" && !valid.Identifier(selector), errs.QueryBadSelector)
			}
		}
	*/
}

func Handler(w web.ResponseWriter, r *http.Request) {
	// parser := mustNewParser(r.Body)
	// mustValidate(data)
}

func mustValidate(data parsing.Source) {
	for labels, pairs := range data {
		throw.If(!valid.Identifier(labels), errs.InvalidIdentifier)
		for id, selector := range pairs {
			throw.If(!valid.Number(id), errs.PropInvalidNumber)
			throw.If(selector != "*" && !valid.Identifier(selector), errs.QueryBadSelector)
		}
	}
}
