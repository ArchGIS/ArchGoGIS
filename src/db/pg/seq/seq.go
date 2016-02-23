package seq

import (
	"db/pg"
	"db/pg/errs"
	"errors"
	"fmt"
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

func NextId(tableName string) (string, error) {
	if seqName, ok := idSequences[tableName]; ok {
		return NextString(seqName)
	} else {
		return "", errs.IdSeqNotFound(tableName)
	}
}

func NextIds(tableName string, n int) ([]string, error) {
	if n == 0 {
		return nil, errors.New("cant fetch 0 ids")
	}

	if seqName, ok := idSequences[tableName]; ok {
		ids := make([]string, n)

		rows, err := pg.Agent.Query(
			fmt.Sprintf("SELECT NEXTVAL('%s') FROM GENERATE_SERIES(1, %d)", seqName, n),
		)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		for i := 0; rows.Next(); i += 1 {
			if err := rows.Scan(&ids[i]); err != nil {
				return nil, err
			}
		}
		if err := rows.Err(); err != nil {
			return nil, err
		}

		return ids, nil
	} else {
		return nil, errs.IdSeqNotFound(tableName)
	}
}

func NextString(seqName string) (string, error) {
	var val string
	err := pg.Agent.QueryRow("SELECT NEXTVAL('" + seqName + "')").Scan(&val)

	return val, err
}

func NextInt(seqName string) (int, error) {
	var val int
	err := pg.Agent.QueryRow("SELECT NEXTVAL('" + seqName + "')").Scan(&val)

	return val, err
}
