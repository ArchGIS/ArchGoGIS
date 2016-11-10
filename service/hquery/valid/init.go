package valid

import (
	"regexp"
)

func init() {
	identifierMatcher = regexp.MustCompile(`^[a-zA-Z0-9\-_]*$`)
}
