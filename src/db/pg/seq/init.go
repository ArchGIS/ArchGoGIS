package seq

import (
	"cfg"
)

var idSequences map[string]string

func init() {
	totalLabels := len(cfg.HqueryPermittedNodeLabels) + len(cfg.HqueryPermittedEdgeLabels)
	idSequences = make(map[string]string, totalLabels)

	for _, nodeLabel := range cfg.HqueryPermittedNodeLabels {
		idSequences[nodeLabel.Key] = nodeLabel.Seq
	}

	for _, edgeLabel := range cfg.HqueryPermittedEdgeLabels {
		idSequences[edgeLabel.Key] = edgeLabel.Seq
	}
}
