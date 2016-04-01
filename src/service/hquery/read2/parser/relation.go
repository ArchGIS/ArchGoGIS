package parser

const (
	// Уникальность:
	single = true
	multi  = false
	// Опциональность:
	optional  = true
	mandatory = false
)

func newRightRelation(parentLabel string, rule *rule) Relation {
	rel := rule.name
	renaming := labelRenamings[rule.target]

	if renaming == "" {
		panic("empty renaming: " + renaming)
	}

	switch rule.count {
	case "{1}":
		return Relation{exactRightMatch, rel, single, mandatory, renaming}
	case "{1,}":
		return Relation{exactRightMatch, rel, multi, mandatory, renaming}
	case "{0,1}":
		return Relation{optionalRightMatch, rel, single, optional, renaming}
	case "{0,}":
		return Relation{optionalRightMatch, rel, multi, optional, renaming}
	default:
		panic("unknown pattern")
	}
}

func newLeftRelation(parentLabel string, rule *rule) Relation {
	rel := getTree[rule.target][parentLabel].name
	renaming := labelRenamings[rule.target]

	if renaming == "" {
		panic("empty renaming: " + parentLabel)
	}

	switch rule.count {
	case "{1}":
		return Relation{exactLeftMatch, rel, single, mandatory, renaming}
	case "{1,}":
		return Relation{exactLeftMatch, rel, multi, mandatory, renaming}
	case "{0,1}":
		return Relation{optionalLeftMatch, rel, single, optional, renaming}
	case "{0,}":
		return Relation{optionalLeftMatch, rel, multi, optional, renaming}
	default:
		panic("unknown pattern")
	}
}
