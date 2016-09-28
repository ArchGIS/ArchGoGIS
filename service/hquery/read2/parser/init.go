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
		"Contains {1,} Knowledge",
	},
	"Organization": {
		"{0,} Author",
	},
	"Knowledge": {
		"HasPhoto {0,} Photo",
		"HasDocument {0,} Document",
		"Describes {1} Monument",
		"CultureOf {1} Culture",
		"{1} Research",
	},
	"Monument": {
		"Contains {0,} Object",
		"TypeOf {1} MonumentType",
		"EpochOf {1} Epoch",
		"{1,} Knowledge",
	},
	"Epoch":        {},
	"Object":       {},
	"Culture":      {},
	"MonumentType": {},
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
	"Culture":      "Culture",
	"MonumentType": "MonumentType",
	"Epoch":        "Epoch",
	// Меняющие название:
	"Photo":    "File",
	"Document": "File",
	"Coauthor": "Author",
}

var statementMatcher = regexp.MustCompile(
	`([a-z][a-z0-9]*):([A-Z][A-Za-z]*)\.([a-z]\w*)`,
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
