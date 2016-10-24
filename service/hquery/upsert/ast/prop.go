package ast

import (
	"strings"

	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/valid"
	"github.com/ArchGIS/ArchGoGIS/throw"
)

func mustNewProps(rawProps map[string]string) map[string]string {
	props := make(map[string]string, len(rawProps)+1)

	for rawKey, rawVal := range rawProps {
		key, val := mustFetchKeyVal(rawKey, rawVal)
		props[key] = val
	}

	return props
}

func mustFetchKeyVal(rawKey, rawVal string) (string, string) {
	if rawKey == "id" { // Особый случай. У id нет typeHint, поэтому key == name
		return mustFetchNumber("id", rawVal)
	}

	nameAndTypeHint := strings.Split(rawKey, "/")

	throw.If(len(nameAndTypeHint) < 2, errs.PropNoTypeHint)
	throw.If(len(nameAndTypeHint) > 2, errs.PropInvalidKey)

	name, typeHint := nameAndTypeHint[0], nameAndTypeHint[1]
	throw.If(!valid.Identifier(name), errs.InvalidIdentifier)

	switch typeHint {
	case "number":
		return mustFetchNumber(name, rawVal)
	case "text":
		return mustFetchText(name, rawVal)
	default:
		throw.Error(errs.PropUnknownTypeHint)
		panic("unreachable")
	}
}

func mustFetchNumber(key, val string) (string, string) {
	throw.If(!valid.Number(val), errs.PropInvalidNumber)
	return key, val
}

func mustFetchText(key, val string) (string, string) {
	throw.If(len(val) > valid.TextLen, errs.PropTextTooLong)
	return key, `"` + val + `"`
}
