package assert

import (
	"echo"
	"fmt"
)

func PanicOnError(e error) {
	if e != nil {
		panic(e)
	}
}

func LogOnError(e error) {
	if e != nil {
		echo.Fail.Print(e.Error())
	}
}
