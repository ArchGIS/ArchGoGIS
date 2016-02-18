package ast

import (
	"service/hquery/errs"
	"strings"
)

type BinOp struct {
	Lhs string
	Rhs string
}

type Prop struct {
	Key string
	Val string
}

// "foo:Monument" -> { "foo:Monument", "foo", "Monument" }
type Descriptor struct {
	Full  string
	Name  string
	Label string
	Ops   *BinOp
}

func NewDescriptor(rawDescriptor string) (*Descriptor, error) {
	if len(rawDescriptor) > maxRawDescriptorLen {
		return nil, errs.LongDescriptorString
	}

	nameAndLabel := strings.Split(rawDescriptor, ":")
	if len(nameAndLabel) != 2 {
		return nil, errs.LabelMissing
	}

	// #FIXME: проверять nameAndLabel[0] на валидность name

	if lhsAndRhs := strings.Split(nameAndLabel[0], "->"); len(lhsAndRhs) > 1 {
		if len(lhsAndRhs) == 2 {
			return descriptorWithOps(rawDescriptor, nameAndLabel, lhsAndRhs), nil
		} else {
			return nil, errs.MultipleArrows
		}
	}

	return descriptorWithoutOps(rawDescriptor, nameAndLabel), nil
}

func NewProp(key, val string) (*Prop, error) {
	nameAndTypeHint := strings.Split(key, "/") // [name, typeHint]

	// len(parts) должно быть равно 2
	if len(nameAndTypeHint) < 2 {
		return nil, errs.NoPropTypeHint
	} else if len(nameAndTypeHint) > 2 {
		return nil, errs.InvalidPropKey
	}

	name, typeHint := nameAndTypeHint[0], nameAndTypeHint[1]

	switch typeHint {
	case "number":
		return &Prop{name, val}, nil
	case "text":
		return &Prop{name, "'" + val + "'"}, nil
	default:
		return nil, errs.BadPropTypeHint
	}
}
