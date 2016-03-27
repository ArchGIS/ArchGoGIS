package read2

import (
	"regexp"
)

const (
	// Уникальность:
	single = true
	multi  = false
	// Опциональность:
	optional  = true
	mandatory = false
)

var mergeRelations = map[string]map[string]Relation{
	"Author": {
		"Organization": {"WorkedIn", multi, optional},
	},
}

var getRelations = map[string]map[string]Relation{
	"Coauthor": {
		"Research": {"HelpedToCreate", multi, optional},
	},
	"Author": {
		"Research":     {"Created", single, mandatory},
		"Organization": {"WorkedIn", multi, optional},
	},
	"Research": {
		"Knowledge": {"Contains", multi, mandatory},
	},
	"Knowledge": {
		"Monument": {"Describes", single, mandatory},
		"Document": {"HasDocument", multi, optional},
		"Photo":    {"HasPhoto", multi, optional},
	},
	"Monument": {
		"Object": {"Contains", single, optional},
	},
}

// Храним в том числе и неизменяемые названия для лучшего быстродействия.
var classRenamings = map[string]string{
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
