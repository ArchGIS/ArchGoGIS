package stmt

import (
	"service/hquery/ast"
	"strings"
)

func BuildRelation(descriptor *ast.Descriptor, fields fields) (string, error) {
	return build(Relation{descriptor}, fields)
}

func BuildInsert(descriptor *ast.Descriptor, fields fields) (string, error) {
	return build(Insert{descriptor}, fields)
}

func BuildUpdate(descriptor *ast.Descriptor, fields fields) (string, error) {
	id := fields["id"]
	delete(fields, "id")

	return build(Update{descriptor, id}, fields)
}

func build(yielder yielder, fields fields) (string, error) {
	pieces := make([]string, 0, len(fields))

	for fieldKey, fieldVal := range fields {
		prop, err := ast.NewProp(fieldKey, fieldVal)
		if err != nil {
			return "", err
		}

		pieces = append(pieces, yielder.yieldProp(prop))
	}

	return yielder.yieldResult(strings.Join(pieces, ",")), nil
}
