package read2

func newMergeData() mergeData {
	return mergeData{
		make(map[string]string),
		make(map[string]struct{}),
	}
}

func (my *mergeData) add(from, to string) {
	my.mapping[from] = to
	my.index[to] = struct{}{}
}

func (my *mergeData) isMerging(key string) bool {
	_, merging := my.index[key]
	return merging
}
