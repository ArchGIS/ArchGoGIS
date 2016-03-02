package upsert

func (my *Data) insertSize() int {
	return len(my.nodeInserts) + len(my.edges)
}

func (my *Data) updateSize() int {
	return len(my.nodeUpdates)
}
