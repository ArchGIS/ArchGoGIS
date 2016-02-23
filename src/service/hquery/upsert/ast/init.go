package ast

import (
	"regexp"
)

func init() {
	identifierMatcher = regexp.MustCompile(`^[a-zA-Z]\w*$`)
}
