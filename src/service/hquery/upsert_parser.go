package hquery

import (
	"service/hquery/ast"
	"service/hquery/errs"
	"service/hquery/stmt"
)

func (my *UpsertParser) parse() error {
	// Обработать каждый entry
	for nameAndLabel, entry := range my.entries {
		if err := my.parseEntry(nameAndLabel, entry); err != nil {
			return err
		}
	}

	// Проверить lhs & rhs для связей
	for _, relation := range my.relations {
		if !my.hasRef(relation.Lhs) || !my.hasRef(relation.Rhs) {
			return errs.MissingRefs
		}
	}

	return nil
}

func (my *UpsertParser) parseEntry(nameAndLabel string, entry entry) error {
	descriptor, err := ast.NewDescriptor(nameAndLabel)
	if err != nil {
		return err
	}

	switch {
	case descriptor.HasRelations():
		return my.parseRelation(descriptor, entry)
	case entry["id"] != "":
		return my.parseUpdate(descriptor, entry)
	default:
		return my.parseInsert(descriptor, entry)
	}
}

func (my *UpsertParser) parseRelation(descriptor *ast.Descriptor, entry map[string]string) error {
	query, err := stmt.BuildRelation(descriptor, entry)
	if err != nil {
		return err
	}

	my.relations = append(my.relations, &relation{descriptor.Ops, query})
	return nil
}

func (my *UpsertParser) parseUpdate(descriptor *ast.Descriptor, entry map[string]string) error {
	query, err := stmt.BuildUpdate(descriptor, entry)
	if err != nil {
		return err
	}

	my.updates[descriptor.Name] = query
	return nil
}

func (my *UpsertParser) parseInsert(descriptor *ast.Descriptor, entry map[string]string) error {
	query, err := stmt.BuildInsert(descriptor, entry)
	if err != nil {
		return err
	}

	my.inserts[descriptor.Name] = query
	return nil
}

func (my *UpsertParser) hasRef(key string) bool {
	if _, ok := my.inserts[key]; ok {
		return true
	}

	if _, ok := my.updates[key]; ok {
		return true
	}

	return false
}
