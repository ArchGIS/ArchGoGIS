package stmt

type Update string
type Insert string

type Relation struct {
	Lhs   string
	Rhs   string
	query string
}

func NewUpdate(descriptor, id, props string) Update {
	return Update("MATCH (" + descriptor + " {id: " + id + "}) SET " + props)
}

func NewInsert(descriptor, props string) Insert {
	return Insert("CREATE (" + descriptor + " {" + props + "})")
}

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
