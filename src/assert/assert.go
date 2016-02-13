// Примечание: использовать только в тестах!
package assert

func Nil(maybeNils ...interface{}) chain {
	for i := range maybeNils {
		if maybeNils[i] != nil {
			println("assert.Nil failed!")
			panic(maybeNils[i])
		}
	}

	return chainer
}

func NotNil(maybeNils ...interface{}) chain {
	for i := range maybeNils {
		if maybeNils[i] == nil {
			println("assert.NotNil failed!")
			panic(maybeNils[i])
		}
	}

	return chainer
}
