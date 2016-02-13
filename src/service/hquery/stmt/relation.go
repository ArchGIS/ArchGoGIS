package stmt

type Relation struct {
	lhs   string
	rhs   string
	query string
}

func NewRelation(names []string, label string, props string) *Relation {
	relation := &Relation{
		lhs: names[0],
		rhs: names[1],
	}

	if props == "" {
		relation.query =
			"CREATE (" + names[0] + ")-[:" + label + "]->(" + names[1] + ")"
	} else {
		relation.query =
			"CREATE (" + names[0] + ")-[:" + label + " {" + props + "}]->(" + names[1] + ")"
	}

	return relation
}

func (my Relation) String() string {
	return my.query
}
