package hquery

import (
	// "service/hquery/ast"
	// "service/hquery/stmt"
	"testing"
)

func NewParser(input entries) *UpsertParser {
	return &UpsertParser{
		entries: input,
		updates: make(entry, len(input)),
		inserts: make(entry, len(input)),
	}
}

var correctInput = entries{
	"a:Monument": entry{
		"x/number":  "3",
		"name/text": "hola",
	},
	"b:Monument": entry{
		"id":       "10",
		"x/number": "4",
	},
	"a->b:Connection": entry{
		"value/number": "9999",
	},
	"b->a:Connection": entry{},
}

var badInput = entries{
	"a:Monument": entry{
		"x/number":  "3",
		"name/text": "hola",
	},
	"b->v:Connection": entry{},
}

func TestSuccessParse(t *testing.T) {
	parser := NewParser(correctInput)
	err := parser.parse()

	if err != nil {
		t.Errorf("unexpected error: %d\n", err.Error())
	}
}

func TestFailedParse(t *testing.T) {
	parser := NewParser(badInput)
	err := parser.parse()

	if err == nil {
		t.Error("expected fail, but got success")
	}
}
