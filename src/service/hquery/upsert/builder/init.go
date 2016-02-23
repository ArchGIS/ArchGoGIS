package builder

import (
	"cfg"
	"fmt"
)

var placeholders []string

func init() {
	// Нам не понадобится больше имён для placeholder'ов, чем у нас
	// вообще можно быть параметров в запросе.
	// #FIXME: хотя здесь важен лимит именно на количество свойств в insert
	// запросах. Мы можем использовать меньше памяти.
	placeholders = make([]string, cfg.HqueryMaxPropsTotal)

	for i := 0; i < cfg.HqueryMaxPropsTotal; i++ {
		placeholders[i] = fmt.Sprintf("p%d", i) // p0, p1, ..., pn
	}
}
