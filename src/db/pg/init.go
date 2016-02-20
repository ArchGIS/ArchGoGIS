package pg

import (
	"assert"
	"cfg"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func init() {
	dns := fmt.Sprintf(
		"user=%s password=%s dbname=%s sslmode=disable",
		cfg.PgUserName,
		cfg.PgPassword,
		cfg.PgDatabase,
	)

	Agent = assert.Must(sql.Open("postgres", dns)).(*sql.DB)

	// Нам всё ещё нужно проверить, что мы подключились.
	// postgres драйвер неохотно ведает о неправильном логине/пароле,
	// поэтому nil ошибка в connect ничего нам не гарантирует.
	assert.Nil(Agent.Ping())
}
