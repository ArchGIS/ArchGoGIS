package ast

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"strings"
)

func newProps(rawProps map[string]string) ([]*Prop, error) {
	// Всегда резервируем памяти под 1 дополнительный параметр (id)
	props := make([]*Prop, 0, len(rawProps)+1)

	for key, val := range rawProps {
		prop, err := newProp(key, val)
		if err != nil {
			return nil, err
		}

		props = append(props, prop)
	}

	return props, nil
}

func newProp(key, val string) (*Prop, error) {
	if key == "id" { // Особый случай. У id нет typeHint, поэтому key == name
		return newNumberProp("id", val)
	}

	nameAndTypeHint := strings.Split(key, "/")

	// len(parts) должно быть равно 2
	if len(nameAndTypeHint) < 2 {
		return nil, errs.PropNoTypeHint
	} else if len(nameAndTypeHint) > 2 {
		return nil, errs.PropInvalidKey
	}

	name, typeHint := nameAndTypeHint[0], nameAndTypeHint[1]
	if !valid.Identifier(name) {
		return nil, errs.InvalidIdentifier
	}

	switch typeHint {
	case "number":
		return newNumberProp(name, val)
	case "text":
		return newTextProp(name, val)
	default:
		return nil, errs.PropUnknownTypeHint
	}
}

func newNumberProp(key, val string) (*Prop, error) {
	if valid.Number(val) {
		return &Prop{key, val}, nil
	} else {
		return nil, errs.PropInvalidNumber
	}
}

func newTextProp(key, val string) (*Prop, error) {
	if len(val) > valid.TextLen {
		return nil, errs.PropTextTooLong
	}

	return &Prop{key, `"` + val + `"`}, nil
}
