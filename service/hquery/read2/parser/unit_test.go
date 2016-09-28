package parser

import (
	"github.com/ArchGIS/ArchGoGIS/assert"
	"encoding/json"
	"strings"
	"testing"
)

func makeQuery(rawQuery string) map[string]interface{} {
	var query map[string]interface{}
	err := json.Unmarshal([]byte(rawQuery), &query)
	assert.Nil(err)

	return query
}

func blame(expected, got string, t *testing.T) {
	t.Errorf("\nexpected:\n`%s`\ngot:\n`%s`\n", expected, got)
}

func blameArr(expectedArr []string, got string, t *testing.T) {
	expected := strings.Join(expectedArr, "`\nOR\n`")
	t.Errorf("\nexpected:\n`%s`\ngot:\n`%s`\n", expected, got)
}

func anyMatch(elts []string, needle string) bool {
	for _, elt := range elts {
		if elt == needle {
			return true
		}
	}

	return false
}

func TestGetById1(t *testing.T) {
	got := string(New(makeQuery(`{"a:Author.getBy": 1}`)).GenerateCypher())
	expected := `MATCH (a:Author {id:1})RETURN a`

	if got != expected {
		blame(expected, got, t)
	}
}

func TestGetById2(t *testing.T) {
	got := string(New(makeQuery(`{"o:Organization.getBy": 1}`)).GenerateCypher())
	expected := `MATCH (o:Organization {id:1})RETURN o`

	if got != expected {
		blame(expected, got, t)
	}
}

func TestGetById3(t *testing.T) {
	query := makeQuery(`{
		"a1:Author.getBy": 1,
		"a2:Author.getBy": 2
	}`)

	got := string(New(query).GenerateCypher())
	expected := []string{
		`MATCH (a1:Author {id:1})MATCH (a2:Author {id:2})RETURN a1,a2`,
		`MATCH (a1:Author {id:1})MATCH (a2:Author {id:2})RETURN a2,a1`,
		`MATCH (a2:Author {id:2})MATCH (a1:Author {id:1})RETURN a1,a2`,
		`MATCH (a2:Author {id:2})MATCH (a1:Author {id:1})RETURN a2,a1`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}

func TestGetByRel1(t *testing.T) {
	query := makeQuery(`{
		"a:Author.getBy": 1,
		"o:Organization.getBy": "a"
	}`)
	parser := New(query)

	got := string(parser.GenerateCypher())
	expected := []string{
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN a,COLLECT(o) AS o`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(o) AS o,a`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}

func TestGetByRel2(t *testing.T) {
	query := makeQuery(`{
		"o:Organization.getBy": 1,
		"a:Author.getBy": "o"
	}`)
	parser := New(query)

	got := string(parser.GenerateCypher())
	expected := []string{
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN o,COLLECT(a) AS a`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a) AS a,o`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}

func TestGetByMerge1(t *testing.T) {
	query := makeQuery(`{
		"o:Organization.getBy": 1,
		"a:Author.mergeBy": "o"
	}`)
	parser := New(query)

	got := string(parser.GenerateCypher())
	prefix := `MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN `
	expected := []string{
		prefix + `COLLECT(a) AS a,COLLECT(a_o) AS a_o,o`,
		prefix + `COLLECT(a_o) AS a_o,COLLECT(a) AS a,o`,
		prefix + `COLLECT(a_o) AS a_o,o,COLLECT(a) AS a`,
		prefix + `COLLECT(a) AS a,o,COLLECT(a_o) AS a_o`,
		prefix + `o,COLLECT(a) AS a,COLLECT(a_o) AS a_o`,
		prefix + `o,COLLECT(a_o) AS a_o,COLLECT(a) AS a`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}

func TestGetByMerge2(t *testing.T) {
	query := makeQuery(`{
		"a:Author.getBy": 1,
		"o:Organization.mergeBy": "a"
	}`)
	parser := New(query)

	got := string(parser.GenerateCypher())
	prefix := `MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN `
	expected := []string{
		prefix + `COLLECT(o) AS o,COLLECT(a_o) AS a_o,a`,
		prefix + `COLLECT(a_o) AS a_o,COLLECT(o) AS o,a`,
		prefix + `COLLECT(a_o) AS a_o,a,COLLECT(o) AS o`,
		prefix + `COLLECT(o) AS o,a,COLLECT(a_o) AS a_o`,
		prefix + `a,COLLECT(o) AS o,COLLECT(a_o) AS a_o`,
		prefix + `a,COLLECT(a_o) AS a_o,COLLECT(o) AS o`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}
