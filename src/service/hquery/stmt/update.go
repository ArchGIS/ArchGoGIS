package stmt

func NewUpdate(descriptor, id, props string) Update {
	return Update("MATCH (" + descriptor + " {id: " + id + "}) SET " + props)
}

func (my Update) String() string {
	return string(my)
}
