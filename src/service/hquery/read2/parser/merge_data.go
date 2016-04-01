package parser

func newMergeData() MergeData {
	return MergeData{
		make(map[string]string),
		make(map[string]struct{}),
	}
}

func (my *MergeData) add(from, to *Statement) {
	my.Mapping[from.id+"_"+to.id] = to.id
	my.index[to.id] = struct{}{}
}

func (my *MergeData) IsMerging(key string) bool {
	_, merging := my.index[key]
	return merging
}
