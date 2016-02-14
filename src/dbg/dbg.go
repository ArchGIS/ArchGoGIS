package dbg

import (
	"fmt"
)

func Dump(any interface{}) {
	fmt.Printf("<<< DEBUG >>>\n%+v\n>>>       <<<\n", any)
}

func DumpSome(some ...interface{}) {
	for i := range some {
		Dump(some[i])
	}
}
