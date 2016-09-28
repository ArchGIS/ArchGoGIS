package throw

func If(cond bool, err error) {
	if cond {
		Error(err)
	}
}

func OnError(err error) {
	if err != nil {
		Error(err)
	}
}

func Error(err error) {
	panic(err)
}

func Guard(err error, guardian func(error)) {
	if err != nil {
		guardian(err)
	}
}

// Catch ловит брошенные внутри тела функции ошибки (panic(err)).
// Должен вызываться через defer.
func Catch(catcher func(error)) {
	if err := recover(); err != nil {
		catcher(err.(error))
	}
}
