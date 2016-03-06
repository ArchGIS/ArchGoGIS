package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"throw"
)

func mustValidateSelector(selector string) {
	if selector != "*" { // Единственный поддерживаемый на данный момент
		throw.Error(errs.QueryBadSelector)
	}
}

func mustValidateMatcher(matcher string) {
	if matcher == "" {
		throw.Error(errs.QueryNoMatcher)
	} else {
		if matcher != "*" && matcher != "?" && !valid.Number(matcher) {
			throw.Error(errs.QueryBadMatcher)
		}
	}
}
