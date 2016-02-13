package hquery

import (
	"service/hquery/stmt"
)

type UpsertEntry map[string]string
type UpsertBatch map[string]UpsertEntry

type UpdateMap map[string]stmt.Update
type InsertMap map[string]stmt.Insert

type prop struct {
	key string
	val string
}

type UpsertParser struct {
	batch     UpsertBatch
	updates   UpdateMap
	inserts   InsertMap
	relations []*stmt.Relation
}
