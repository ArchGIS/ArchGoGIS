package cfg

import (
	"unicode/utf8"
)

const (
	HqueryUpsertMaxInputLen = 4096
	HqueryReadMaxInputLen   = 1024
	HqueryReadDefaultLimit  = "10"
	HqueryReadMaxLimit      = "100"
	HqueryMaxEntries        = 32
	HqueryMaxPropsPerEntry  = 24
	HqueryMaxPropsTotal     = 120
	HqueryMaxTagLen         = 48
	HqueryMaxTextLen        = 256
)

var (
	HqueryValidators = map[string]map[string]func(string) bool{
		"Author": {
			"name": func(name string) bool {
				// У нас строка будет содержать ещё и кавычки, поэтому -2
				return (utf8.RuneCountInString(name) - 2) > 3
			},
		},
	}
)

var (
	HqueryPermittedNodeLabels = []HqueryNodeLabel{
		{"Author", "n_author_id_seq"},
		{"Monument", "n_monument_id_seq"},
		{"Knowledge", "n_knowledge_id_seq"},
		{"Research", "n_research_id_seq"},
		{"Geometry", "n_geometry_id_seq"},
		{"Object", "n_object_id_seq"},
		{"Artifact", "n_artifact_id_seq"},
		{"Organization", "n_organization_seq"},
	}

	HqueryPermittedEdgeLabels = []HqueryEdgeLabel{
		{"Describes"},
		{"Has"},
		{"Contains"},
		{"Created"},
		{"HelpedToCreate"},
		{"WorkedIn"},
	}
)
