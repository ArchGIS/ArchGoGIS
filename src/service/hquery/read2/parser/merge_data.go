package parser

func newMergeData() MergeData {
	return MergeData{
		make(map[string]string),
		make(map[string]struct{}),
	}
}

func (my *MergeData) add(from, to string) {
	my.Mapping[from] = to
	my.index[to] = struct{}{}
}

func (my *MergeData) IsMerging(key string) bool {
	_, merging := my.index[key]
	return merging
}
