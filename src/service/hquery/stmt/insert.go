package stmt

func NewInsert(descriptor, props string) Insert {
	return Insert("CREATE (" + descriptor + " {" + props + "})")
}

func (my Insert) String() string {
	return string(my)
}
