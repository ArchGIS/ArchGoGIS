package fetch

import (
	"service/hquery/errs"
	"service/hquery/valid"
	"strings"
)

func NameAndLabels(tag string) (string, string, error) {
	labelSepPos := strings.IndexByte(tag, ':')
	if labelSepPos == -1 {
		return "", "", errs.TagLabelMissing
	}

	name, labels := tag[:labelSepPos], tag[labelSepPos+1:]

	if !valid.Identifier(name) {
		return "", "", errs.InvalidIdentifier
	}

	return name, labels, nil
}

func DestructureEdgeTag(tag string) (string, string, string, error) {
	parts := strings.Split(tag, "_")
	if len(parts) != 3 {
		return "", "", "", errs.TagBadFormat
	}

	lhs, ty, rhs := parts[0], parts[1], parts[2]

	if !valid.Identifier(lhs) || !valid.Identifier(rhs) || !valid.Identifier(ty) {
		return "", "", "", errs.InvalidIdentifier
	}

	return lhs, ty, rhs, nil
}
