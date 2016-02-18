package ast

func descriptorWithOps(rawDescriptor string, nameAndLabel, lhsAndRhs []string) *Descriptor {
	return &Descriptor{
		Full:  rawDescriptor,
		Name:  nameAndLabel[0],
		Label: nameAndLabel[1],
		Ops:   &BinOp{lhsAndRhs[0], lhsAndRhs[1]},
	}
}

func descriptorWithoutOps(rawDescriptor string, nameAndLabel []string) *Descriptor {
	return &Descriptor{
		Full:  rawDescriptor,
		Name:  nameAndLabel[0],
		Label: nameAndLabel[1],
	}
}
