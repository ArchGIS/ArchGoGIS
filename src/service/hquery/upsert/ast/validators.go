package ast

import (
	"regexp"
	"strconv"
)

const maxTextLen = 256

var identifierMatcher *regexp.Regexp

func isNumber(maybeNumber string) bool {
	// Возможно не самый лучший в разных смыслах способ, зато one-liner
	_, err := strconv.Atoi(maybeNumber)

	return err == nil
}

func isIdentifier(maybeIdentifier string) bool {
	return identifierMatcher.MatchString(maybeIdentifier)
}
