package parser

import (
	"strings"
)

func (my *rule) isAnonymous() bool {
	return my.name == ""
}

func parseRule(rawRule string) *rule {
	tokens := strings.Split(rawRule, " ")

	switch len(tokens) {
	case 2:
		return &rule{"", tokens[0], tokens[1]}
	case 3:
		return &rule{tokens[0], tokens[1], tokens[2]}
	default:
		panic("unknown rule format")
	}
}
