package neo

import (
	"web/neo/builder"
)

func (my *Query) ResetStatements() {
	my.builder = builder.New()
}

func (my *Query) AddStatement(statement string) {
	my.builder.AddStatement(statement)
}

func (my *Query) Run() (*Response, error) {
	return tryNewResponse(agent.Post(endpoint, my.builder.Bytes()))
}
