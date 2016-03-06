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
