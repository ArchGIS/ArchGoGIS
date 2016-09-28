package ast

import (
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/valid"
	"github.com/ArchGIS/ArchGoGIS/throw"
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
