package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
)

func newMatcher(pattern string) (Matcher, error) {
	if pattern == "*" || pattern == "?" || valid.Number(pattern) {
		return Matcher(pattern), nil
	}

	return "", errs.SlotsBadMatcher
}

func (my Matcher) Any() bool {
	return my[0] == '*'
}

func (my Matcher) One() bool {
	return my[0] == '?'
}

func (my Matcher) Exact() bool {
	return !my.Any() && !my.One()
}
