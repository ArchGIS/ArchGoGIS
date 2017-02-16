package cfg

import (
	"unicode/utf8"
)

const (
	HqueryUpsertMaxInputLen = 20048
	HqueryReadMaxInputLen   = 1024
	HqueryReadDefaultLimit  = "50"
	HqueryReadMaxLimit      = "500"
	HqueryMaxEntries        = 32
	HqueryMaxPropsPerEntry  = 24
	HqueryMaxPropsTotal     = 1200
	HqueryMaxTagLen         = 48
	HqueryMaxTextLen        = 20048
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
		{"Report", "n_report_id_seq"},
		{"HeritageStatus", "n_heritage_status_id_seq"},
		{"File", "n_file_id_seq"},
		{"MonumentAnalysis", "n_monument_analysis_id_seq"},
		{"Epoch", "n_epoch_id_seq"},
		{"Culture", "n_culture_id_seq"},
		{"ResearchType", "n_research_type_id_seq"},
		{"Complex", "n_Complex_id_seq"},
		{"Image", "n_image_id_seq"},
		{"City", "n_city_id_seq"},
		{"AuthorJob", "n_author_job_id_seq"},
		{"Excavation", "n_excavation_id_seq"},
		{"SurveyMap", "n_survey_map_id_seq"},
		{"Heritage", "n_Heritage_id_seq"},
		{"Interpretation", "n_interpretation_id_seq"},
		{"StorageInterval", "n_storage_interval_id_seq"},
		{"Collection", "n_collection_id_seq"},
		{"Publication", "n_publication_id_seq"},
	}

	HqueryPermittedEdgeLabels = []HqueryEdgeLabel{
		{"describes"},
		{"has"},
		{"hasauthor"},
		{"hascoauthor"},
		{"contains"},
		{"created"},
		{"belongsto"},
		{"founded"},
		{"hasreport"},
		{"workedIn"},
	}
)
