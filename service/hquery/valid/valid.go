package valid

import (
	"regexp"
	"strconv"
)

const TextLen = 81920 // #FIXME: вынести в cfg

var identifierMatcher *regexp.Regexp

func Number(maybeNumber string) bool {
	// Возможно не самый лучший в разных смыслах способ, зато one-liner
	_, err := strconv.ParseFloat(maybeNumber, 64)

	return err == nil
}

func Identifier(maybeIdentifier string) bool {
	return identifierMatcher.MatchString(maybeIdentifier)
}
