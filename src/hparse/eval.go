package hparse

import (
	"echo"
	"neo"
	"strings"
)

func Eval(descriptor string, props map[string]string) string {
	key := strings.Split(descriptor, ":")
	if len(key) != 2 {
		return "descriptor must follow the pattern `name:Class`"
	}

	if props["id"] != "" {
		return executeUpdate(key[0], descriptor, props)
	} else {
		return executeInsert(descriptor, props)
	}
}

func executeUpdate(name, descriptor string, props map[string]string) string {
	query, err := buildUpdateQuery(name, descriptor, props)
	if err != nil {
		return err.Error()
	}
	echo.Info.Print(query)

	return "updated"
}

func buildUpdateQuery(name, descriptor string, props map[string]string) (string, error) {
	id := extractId(props)

	parts := make([]string, 0, len(props))
	for propName := range props {
		prop, err := newProp(propName, props[propName])
		if err == nil {
			parts = append(parts, name+"."+prop.Key+"="+prop.Val)
		} else {
			return "", err
		}
	}

	return "MATCH (" + name + " {id: " + id + "}) SET " + strings.Join(parts, ","), nil
}

func extractId(props map[string]string) string {
	id := props["id"]
	// Мы могли бы здесь проверить, является ли id числом.. но зачем?
	delete(props, "id")
	return id
}

func executeInsert(descriptor string, props map[string]string) string {
	query, err := buildInsertQuery(descriptor, props)
	if err != nil {
		return err.Error()
	}
	echo.Info.Print(query)

	return "created"
}

func buildInsertQuery(descriptor string, props map[string]string) (string, error) {
	parts := make([]string, 0, len(props))
	for propName := range props {
		prop, err := newProp(propName, props[propName])
		if err == nil {
			parts = append(parts, prop.Key+": "+prop.Val)
		} else {
			return "", err
		}
	}

	return "CREATE (" + descriptor + " {" + strings.Join(parts, ",") + "})", nil
}
