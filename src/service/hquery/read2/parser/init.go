package parser

import (
	"regexp"
)

const (
	exactRightMatch    = "MATCH (%[1]s)-[%[1]s_%[3]s:%[2]s]->(%[3]s:%[4]s)"
	exactLeftMatch     = "MATCH (%[1]s)<-[%[1]s_%[3]s:%[2]s]-(%[3]s:%[4]s)"
	optionalRightMatch = "OPTIONAL MATCH (%[1]s)-[%[1]s_%[3]s:%[2]s]->(%[3]s:%[4]s)"
	optionalLeftMatch  = "OPTIONAL MATCH (%[1]s)<-[%[1]s_%[3]s:%[2]s]-(%[3]s:%[4]s)"
)

var getTree map[string]map[string]Relation
var getScheme = map[string][]string{
	"Author": {
		"Created {0,} Research",
		"WorkedIn {0,} Organization",
	},
	"Coauthor": {
		"HelpedToCreate {0,} Research",
	},
	"Research": {
		"{1} Author",
		"{0,} Coauthor",
	},
	"Organization": {
		"{0,} Author",
	},
}

// Храним в том числе и неизменяемые названия для лучшего быстродействия.
var labelRenamings = map[string]string{
	// Не имеющие переименования ("настоящие" сущности):
	"Author":       "Author",
	"Knowledge":    "Knowledge",
	"Research":     "Research",
	"Object":       "Object",
	"Monument":     "Monument",
	"Organization": "Organization",
	// Меняющие название:
	"Photo":    "File",
	"Document": "File",
	"Coauthor": "Author",
}

var statementMatcher = regexp.MustCompile(
	`([a-z][a-z0-9]*):([A-Z][a-z]*)\.([a-z]\w*)`,
)

func init() {
	// Инициализируем структуры данных для хранения данных о рёбрах
	getTree = make(map[string]map[string]Relation, len(getScheme))
	for label := range getScheme {
		getTree[label] = make(map[string]Relation, len(getScheme[label]))
	}

	defer func() {
		labelRenamings = nil
		getScheme = nil
	}()

	// Разбор схемы (правил)
	for label1, rawRules := range getScheme {
		for _, rawRule := range rawRules {
			rule := parseRule(rawRule)
			if rule.isAnonymous() {
				defer func(label1 string) {
					getTree[label1][rule.target] = newLeftRelation(label1, rule)
				}(label1)
			} else {
				getTree[label1][rule.target] = newRightRelation(label1, rule)
			}
		}
	}
}
