package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
)

func edgeQueryError(query map[string]string) error {
	switch len(query) {
	case 0:
		return nil

	case 1:
		if !validSelector(query["select"]) {
			return errs.QueryBadSelector
		}
		return nil

	default:
		return errs.QueryBadFormat
	}
}

func nodeQueryError(query map[string]string) error {
	switch len(query) {
	case 0:
		return errs.QueryBadFormat

	case 1:
		if err := matcherError(query["id"]); err != nil {
			return err
		}
		return nil

	case 2:
		if err := matcherError(query["id"]); err != nil {
			return err
		}
		if !validSelector(query["select"]) {
			return errs.QueryBadSelector
		}
		return nil

	default:
		return errs.QueryBadFormat
	}
}

func validSelector(selector string) bool {
	// Селектор опционален, но если он присутствует, то должен следовать
	// определённому формату.
	if selector != "" {
		if selector != "*" { // Единственный поддерживаемый на данный момент
			return false
		}
	}

	return true
}

func matcherError(matcher string) error {
	if matcher == "" {
		return errs.QueryNoMatcher
	} else {
		if matcher != "*" && matcher != "?" && !valid.Number(matcher) {
			return errs.QueryBadMatcher
		}
	}

	return nil
}
