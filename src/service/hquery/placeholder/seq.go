package placeholder

func (my *Seq) Current() string {
	return placeholders[my.index]
}

func (my *Seq) Next() string {
	my.index += 1
	return placeholders[my.index-1]
}
