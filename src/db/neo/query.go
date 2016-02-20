package neo

import (
	"db/neo/builder"
)

func (my *Query) ResetStatements() {
	my.builder = builder.NewQueryBuilder()
}

func (my *Query) AddStatement(statement string) {
	my.builder.AddStatement(statement)
}

func (my *Query) Run() (*Response, error) {
	return tryNewResponse(agent.Post(endpoint, my.builder.Bytes()))
}

func (my *Query) StatementBuilder() *builder.StatementBuilder {
	return &builder.StatementBuilder{}
}
