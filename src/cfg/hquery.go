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
		{"Monument", "n_monument_id_seq"},
		{"Research", "n_research_id_seq"},
	}

	HqueryPermittedEdgeLabels = []HqueryEdgeLabel{
		{"Describes", "e_describes_id_seq"},
	}
)
