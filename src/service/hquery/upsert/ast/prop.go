package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"strings"
)

func newProps(rawProps map[string]string) (map[string]string, error) {
	props := make(map[string]string, len(rawProps)+1)

	for rawKey, rawVal := range rawProps {
		key, val, err := fetchKeyVal(rawKey, rawVal)
		if err != nil {
			return nil, err
		}

		props[key] = val
	}

	return props, nil
}

func fetchKeyVal(rawKey, rawVal string) (string, string, error) {
	if rawKey == "id" { // Особый случай. У id нет typeHint, поэтому key == name
		return fetchNumber("id", rawVal)
	}

	nameAndTypeHint := strings.Split(rawKey, "/")

	// len(parts) должно быть равно 2
	if len(nameAndTypeHint) < 2 {
		return "", "", errs.PropNoTypeHint
	} else if len(nameAndTypeHint) > 2 {
		return "", "", errs.PropInvalidKey
	}

	name, typeHint := nameAndTypeHint[0], nameAndTypeHint[1]
	if !valid.Identifier(name) {
		return "", "", errs.InvalidIdentifier
	}

	switch typeHint {
	case "number":
		return fetchNumber(name, rawVal)
	case "text":
		return fetchText(name, rawVal)
	default:
		return "", "", errs.PropUnknownTypeHint
	}
}

func fetchNumber(key, val string) (string, string, error) {
	if valid.Number(val) {
		return key, val, nil
	} else {
		return "", "", errs.PropInvalidNumber
	}
}

func fetchText(key, val string) (string, string, error) {
	if len(val) > valid.TextLen {
		return "", "", errs.PropTextTooLong
	}

	return key, `"` + val + `"`, nil
}
