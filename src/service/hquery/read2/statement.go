package read2

func NewStatement(tag string, params interface{}) *Statement {
	parts := statementMatcher.FindStringSubmatch(tag)

	return &Statement{parts[1], parts[2], parts[3], params}
}
