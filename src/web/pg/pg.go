package pg

import (
	"database/sql"
	"echo"

	_ "github.com/lib/pq"
)

var agent *sql.DB

func CloseConnection() {
	err := agent.Close()
	if err != nil {
		echo.ServerError.Print(err)
	}
}

func SeqNextVal(name string) (int, error) {
	id := 0
	err := agent.QueryRow("SELECT nextval('" + name + "_id_seq')").Scan(&id)

	return id, err
}
