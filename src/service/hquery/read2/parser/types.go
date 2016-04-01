package parser

type cypherQuery struct {
	projection      []string
	exactMatches    []string
	optionalMatches []string
}

type Relation struct {
	pat      string
	name     string
	unique   bool
	optional bool
	renaming string
}

type Statement struct {
	id     string
	class  string
	method string
	params interface{}
}

type rule struct {
	name   string
	count  string
	target string
}

type MergeData struct {
	Mapping map[string]string
	index   map[string]struct{}
}

type Parser struct {
	statements map[string]*Statement
	query      cypherQuery
	MergeData
}
