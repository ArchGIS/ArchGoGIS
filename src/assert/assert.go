// Примечание: использовать только в тестах и в инициализации сервера,
// когда падение не затронет пользователей.
package assert

var chainer = chain{}

func Nil(maybeNils ...interface{}) chain {
	for i := range maybeNils {
		if maybeNils[i] != nil {
			println("{{ assert.Nil failed! }}")
			panic(maybeNils[i])
		}
	}

	return chainer
}

func NotNil(maybeNils ...interface{}) chain {
	for i := range maybeNils {
		if maybeNils[i] == nil {
			println("{{ assert.NotNil failed! }}")
			panic(maybeNils[i])
		}
	}

	return chainer
}

func Must(object interface{}, err error) interface{} {
	Nil(err)

	return object
}
