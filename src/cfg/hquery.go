package cfg

const (
	HqueryMaxEntries       = 32
	HqueryMaxPropsPerEntry = 24
	HqueryMaxPropsTotal    = 120
	HqueryMaxTagLen        = 48
	HqueryMaxTextLen       = 256
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
	}

	HqueryPermittedEdgeLabels = []HqueryEdgeLabel{
		{"Describes"},
		{"Has"},
		{"Contains"},
		{"Created"},
		{"HelpedToCreate"},
	}
)
