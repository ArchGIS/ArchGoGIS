package neo

func NewQuery(stmt ...Statement) Query {
	this := Query{}

	for i := range stmt {
		this.AddStatement(stmt[i])
	}

	return this
}

func (my *Query) SetBatch(batch Batch) {
	my.batch = batch
}

func (my *Query) AddStatement(stmt Statement) {
	my.batch.AddStatement(stmt)
}

func (my *Query) AddString(body string) {
	my.batch.AddStatement(Statement{body, nil})
}

func (my *Query) Run() (*Response, error) {
	println(string(my.batch.Bytes()))
	return tryNewResponse(agent.Post(endpoint, my.batch.Bytes()))
}
