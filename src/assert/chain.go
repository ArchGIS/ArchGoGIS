package assert

func (my chain) Nil(maybeNils ...interface{}) chain {
	Nil(maybeNils...)
	return my
}

func (my chain) NotNil(maybeNils ...interface{}) chain {
	NotNil(maybeNils...)
	return my
}
