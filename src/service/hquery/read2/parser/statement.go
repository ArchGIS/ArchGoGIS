package parser

func NewStatement(tag string, params interface{}) *Statement {
	parts := statementMatcher.FindStringSubmatch(tag)

	return &Statement{parts[1], parts[2], parts[3], params}
}

func (my *Statement) hasIdParam() bool {
	_, ok := my.params.(float64)
	return ok
}

func (my *Statement) idParam() int {
	return int(my.params.(float64))
}

func (my *Statement) hasParent() bool {
	_, ok := my.params.(string)
	return ok
}
