// Когда использовать assert:
// 1) В тестах, если expected != result
// 2) В коде инициализации сервера, когда падение не затронет пользователей
// 3) В местах, где возникновение ошибки означает какую-то проблему в коде,
//    из-за которой продолжать работу может быть опасно.
package assert

func Nil(maybeNils ...interface{}) {
	for i := range maybeNils {
		if maybeNils[i] != nil {
			println("{{ assert.Nil failed! }}")
			panic(maybeNils[i])
		}
	}
}

func NotNil(maybeNils ...interface{}) {
	for i := range maybeNils {
		if maybeNils[i] == nil {
			println("{{ assert.NotNil failed! }}")
			panic(maybeNils[i])
		}
	}
}
