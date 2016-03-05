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
