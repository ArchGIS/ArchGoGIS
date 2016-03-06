package placeholder

import (
	"cfg"
	"fmt"
)

var placeholders []string

func init() {
	placeholders = make([]string, cfg.HqueryMaxPropsTotal)

	for i := 0; i < cfg.HqueryMaxPropsTotal; i++ {
		placeholders[i] = fmt.Sprintf("p%d", i) // p0, p1, ..., p(n-1)
	}
}
