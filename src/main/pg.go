package main

import (
	"assert"
	"web/pg"
)

func main() {
	defer pg.CloseConnection()
	id, err := pg.SeqNextVal("Monument")
	assert.Nil(err)
	println(id)

	/*
		dns := fmt.Sprintf(
			"user=%s password=%s dbname=%s sslmode=disable",
			DB_USER,
			DB_PASSWORD,
			DB_NAME,
		)

		db, err := sql.Open("postgres", dns)
		assert.Nil(err)
		defer db.Close()

		id := 0
		err = db.QueryRow("SELECT nextval('monument_id_seq')").Scan(&id)
		// err = db.QueryRow("INSERT INTO userinfo(username,departname,created) VALUES($1,$2,$3) returning uid;", "astaxie", "研发部门", "2012-12-09").Scan(&lastInsertId)
		assert.Nil(err)
		fmt.Printf("id = %d\n", id)
	*/
}
