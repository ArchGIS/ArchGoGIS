package seq

import (
	"db/pg"
	"errors"
)

// Префикс n_ для нодов, e_ - для рёбер
var idSequences = map[string]string{
	"Monument":  "n_monument_id_seq",
	"Research":  "n_research_id_seq",
	"Describes": "e_describes_id_seq",
}

// Можно было бы организовать statementPool, подготавливать запросы
// единожды и далее брать их по ключу, но такой подход несёт несколько
// усложнений. Например, если будут network проблемы, то сессия
// с бд будет утрачена и все подготовленные запросы перестанут быть
// валидными. Поэтому как минимум пока - keep it simple.

func NextId(tableName string) (int, error) {
	if seqName, ok := idSequences[tableName]; ok {
		return NextVal(seqName)
	} else {
		return 0, errors.New("id sequence for " + tableName + " not found")
	}
}

func NextVal(seqName string) (int, error) {
	var val int
	err := pg.Agent.QueryRow("SELECT NEXTVAL('" + seqName + "')").Scan(&val)

	return val, err
}
