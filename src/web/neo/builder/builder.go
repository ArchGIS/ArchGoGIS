package builder

func (my *Builder) AddStatement(statement string) {
	my.query.WriteString(`{"statement":"`)
	my.query.WriteString(statement)
	my.query.WriteString(`"},`)
}

func (my *Builder) Bytes() []byte {
	my.query.Truncate(my.query.Len() - 1) // Отбрасываем лишнюю запятую
	my.query.WriteString(`]}`)

	return my.query.Bytes()
}
