package parser

func New(query map[string]interface{}) *Parser {
	statements := make(map[string]*Statement, len(query))
	for tag, params := range query {
		statement := NewStatement(tag, params)
		statements[statement.id] = statement
	}

	return &Parser{
		statements,
		cypherQuery{},
		newMergeData(),
	}
}

func (my *Parser) GenerateCypher() []byte {
	my.mustParseAll()
	return my.query.build()
}

func (my *Parser) mustParseAll() {
	for _, statement := range my.statements {
		switch statement.method {
		case "getBy":
			my.parseGetBy(statement)
		case "mergeBy":
			my.parseMergeBy(statement)
		default:
			panic("unknown method")
		}
	}
}

func (my *Parser) parseMergeBy(statement *Statement) {
	if _, isString := statement.params.(string); isString {
		my.matchMergeBy(statement)
	} else {
		panic("not a valid merge by param")
	}
}

func (my *Parser) parseGetBy(statement *Statement) {
	switch statement.params.(type) {
	case float64:
		my.matchGetById(statement)
	case string:
		my.matchGetBy(statement)

	default:
		panic("unknown type in params")
	}
}

func (my *Parser) matchMergeBy(this *Statement) {
	that := my.statements[this.params.(string)]
	rel := getTree[that.class][this.class]

	my.query.addMerge(that, this, &rel)
	my.MergeData.add(that, this)
}

func (my *Parser) matchGetBy(this *Statement) {
	that := my.statements[this.params.(string)]
	rel := getTree[that.class][this.class]
	println(this.class, that.class)

	my.query.addMatch(that, this, &rel)
	my.query.addProjection(this, that, &rel)
}

func (my *Parser) matchGetById(stmt *Statement) {
	my.query.addStatement(stmt)
}
