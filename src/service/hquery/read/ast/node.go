package ast

import (
	"service/hquery/errs"
	"service/hquery/fetch"
)

func NewNode(tag string, slots []string) (*Node, error) {
	name, labels, err := fetch.NameAndLabels(tag)
	if err != nil {
		return nil, err
	}

	if len(slots) != 2 {
		return nil, errs.NodeSlotsBadFormat
	}

	matcher, err := newMatcher(slots[0])
	if err != nil {
		return nil, err
	}

	switch slots[1] {
	case "+":
		return &Node{tag, name, labels, matcher, true}, nil
	case "-":
		return &Node{tag, name, labels, matcher, false}, nil
	default:
		return nil, errs.SlotsBadSelector
	}
}
