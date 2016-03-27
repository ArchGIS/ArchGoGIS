package parser

type Relation struct {
	name     string
	unique   bool
	optional bool
}

type Statement struct {
	id     string
	class  string
	method string
	params interface{}
}

type MergeData struct {
	Mapping map[string]string
	index   map[string]struct{}
}

type matches struct {
	Exact    []string
	Optional []string
}

type projection []string
type matchFunc func(*Statement, *Statement, Relation)
type relationScheme map[string]map[string]Relation

type segment struct {
	id  string
	rel *Relation
	lhs *Statement
	rhs *Statement
}

type Parser struct {
	statements map[string]*Statement
	matches    matches
	projection projection
	MergeData  MergeData
}
