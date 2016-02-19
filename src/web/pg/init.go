package pg

import (
	"cfg"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func init() {
	var err error

	dns := fmt.Sprintf(
		"user=%s password=%s dbname=%s sslmode=disable",
		cfg.PgUserName,
		cfg.PgPassword,
		cfg.PgDatabase,
	)

	agent, err = sql.Open("postgres", dns)
	if err != nil {
		panic(err)
	}
}
