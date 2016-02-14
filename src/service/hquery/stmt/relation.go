package stmt

func NewRelation(names []string, label string, props string) *Relation {
	relation := &Relation{
		Lhs: names[0],
		Rhs: names[1],
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
