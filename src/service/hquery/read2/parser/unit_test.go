package parser

import (
	"assert"
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
	got := string(newParser(makeQuery(`{"a:Author.getBy": 1}`)).generateCypher())
	expected := `MATCH (a:Author {id:1})RETURN a`

	if got != expected {
		blame(expected, got, t)
	}
}

func TestGetById2(t *testing.T) {
	got := string(newParser(makeQuery(`{"o:Organization.getBy": 1}`)).generateCypher())
	expected := `MATCH (o:Organization {id:1})RETURN o`

	if got != expected {
		blame(expected, got, t)
	}
}

func TestGetByRel1(t *testing.T) {
	query := makeQuery(`{
		"a:Author.getBy": 1,
		"o:Organization.getBy": "a"
	}`)
	parser := newParser(query)

	got := string(parser.generateCypher())
	expected1 :=
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN a,COLLECT(o) AS o`
	expected2 :=
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(o) AS o,a`

	if got != expected1 && got != expected2 {
		blame(expected1+"`\nOR\n`"+expected2, got, t)
	}
}

func TestGetByRel2(t *testing.T) {
	query := makeQuery(`{
		"o:Organization.getBy": 1,
		"a:Author.getBy": "o"
	}`)
	parser := newParser(query)

	got := string(parser.generateCypher())
	expected1 :=
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN o,COLLECT(a) AS a`
	expected2 :=
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a) AS a,o`

	if got != expected1 && got != expected2 {
		blame(expected1+"`\nOR\n`"+expected2, got, t)
	}
}

func TestGetByMerge1(t *testing.T) {
	query := makeQuery(`{
		"o:Organization.getBy": 1,
		"a:Author.mergeBy": "o"
	}`)
	parser := newParser(query)

	got := string(parser.generateCypher())
	expected := []string{
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a) AS a,COLLECT(a_o) AS a_o,o`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a_o) AS a_o,COLLECT(a) AS a,o`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a_o) AS a_o,o,COLLECT(a) AS a`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN COLLECT(a) AS a,o,COLLECT(a_o) AS a_o`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN o,COLLECT(a) AS a,COLLECT(a_o) AS a_o`,
		`MATCH (o:Organization {id:1})OPTIONAL MATCH (a:Author)-[a_o:WorkedIn]->(o)RETURN o,COLLECT(a_o) AS a_o,COLLECT(a) AS a`,
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
	parser := newParser(query)

	got := string(parser.generateCypher())
	expected := []string{
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(o) AS o,COLLECT(a_o) AS a_o,a`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(a_o) AS a_o,COLLECT(o) AS o,a`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(a_o) AS a_o,a,COLLECT(o) AS o`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN COLLECT(o) AS o,a,COLLECT(a_o) AS a_o`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN a,COLLECT(o) AS o,COLLECT(a_o) AS a_o`,
		`MATCH (a:Author {id:1})OPTIONAL MATCH (a)-[a_o:WorkedIn]->(o:Organization)RETURN a,COLLECT(a_o) AS a_o,COLLECT(o) AS o`,
	}

	if !anyMatch(expected, got) {
		blameArr(expected, got, t)
	}
}
