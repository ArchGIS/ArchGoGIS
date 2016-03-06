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

func Catch(err error, catcher func(error)) {
	if err != nil {
		catcher(err)
	}
}

// Guard ловит брошенные внутри тела функции ошибки (panic(err)).
// Должен вызываться через defer.
func Guard(handler func(error)) {
	if err := recover(); err != nil {
		handler(err.(error))
	}
}
