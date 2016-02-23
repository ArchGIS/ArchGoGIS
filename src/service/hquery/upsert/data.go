package upsert

func (my *Data) insertSize() int {
	return len(my.nodeInserts) + len(my.edgeInserts)
}

func (my *Data) updateSize() int {
	return len(my.nodeUpdates) + len(my.edgeUpdates)
}
