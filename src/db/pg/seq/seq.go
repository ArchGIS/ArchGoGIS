package seq

import (
	"db/pg"
)

// Можно было бы организовать statementPool, подготавливать запросы
// единожды и далее брать их по ключу, но такой подход несёт несколько
// усложнений. Например, если будут network проблемы, то сессия
// с бд будет утрачена и все подготовленные запросы перестанут быть
// валидными. Поэтому как минимум пока - keep it simple.

func NextId(tableName string) (int, error) {
	return NextVal(tableName + "_id_seq")
}

func NextVal(seqName string) (int, error) {
	var val int
	err := pg.Agent.QueryRow("SELECT NEXTVAL('" + seqName + "')").Scan(&val)

	return val, err
}
