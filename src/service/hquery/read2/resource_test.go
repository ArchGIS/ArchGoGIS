package read2

import (
	"db/neo"
	"testing"
)

func setup() {
	create := `CREATE (a1:Author {tid:1,name:"A1"})` +
		`CREATE (o1:Organization {tid:1,name:"O1"})` +
		`CREATE (o2:Organization {tid:2,name:"O2"})` +
		`CREATE (a1)-[:WorkedIn {since:1999}]->(o1)` +
		`CREATE (a1)-[:WorkedIn {since:2000}]->(o2)`

	neo.Run(create, nil)
}

func shutdown() {

}

func TestMain(m *testing.M) {
	setup()
	shutdown()
}
