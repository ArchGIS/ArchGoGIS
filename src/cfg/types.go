package cfg

type HqueryNodeLabel struct {
	Key string
	Seq string
}

// #FIXME: нужно ещё учитывать LHS и RHS
type HqueryEdgeLabel struct {
	Key string
	Seq string
}
