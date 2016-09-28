package cfg

import (
	"github.com/ArchGIS/ArchGoGIS/assert"
	"encoding/json"
	"io/ioutil"
)

var Neo struct {
	UserName string
	Password string
	Host     string
}

const (
	PgUserName = "postgres"
	PgPassword = "postgres"
	PgDatabase = "postgres"
)

func init() {
	data, err := ioutil.ReadFile("cfg/db/neo.json")
	assert.Nil(err)
	err = json.Unmarshal(data, &Neo)
	assert.Nil(err)
}
