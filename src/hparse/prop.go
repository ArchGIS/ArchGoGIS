package hparse

import (
	"errors"
	"fmt"
	"strings"
)

type Prop struct {
	Key string
	Val string
}

func newProp(key, val string) (*Prop, error) {
	parts := strings.Split(key, "/") // [name, typeHint]

	if "id" == key {
		return &Prop{"id", val}, nil
	}

	// len(parts) должно быть равно 2
	if len(parts) < 2 && "id" != key {
		return nil, errors.New("only `id` property can omit type hint")
	} else if len(parts) > 2 {
		return nil, errors.New("slash can be used only as type hint separator")
	}

	switch parts[1] {
	case "num":
		return &Prop{parts[0], val}, nil
	case "text":
		return &Prop{parts[0], `"` + val + `"`}, nil
	default:
		return nil, fmt.Errorf("type %s is not supported", parts[1])
	}
}

/*
import (
	"echo"
	"errors"
	"strings"
)

const (
	neo4jLong = iota
	neo4jDouble
	neo4jString
)

type Prop struct {
	tag int
	key string
	val string
}

func getTag(typeHint, val string) (int, error) {
	switch typeHint {
	case "num":
		if strings.Contains(val, ".") {
			return neo4jDouble, nil
		} else {
			return neo4jLong, nil
		}
	case "text":
		return neo4jString, nil

	default:
		return -1, errors.New("unknown property tag")
	}
}

func NewProp(key, val string) (*Prop, error) {
	parts := strings.Split(key, "/")

	if "id" == key {
		return &Prop{LONG, "id", val}, nil
	}

	// len(parts) должно быть равно 2
	if len(parts) < 2 && "id" != key {
		return nil, errors.New("only `id` property can omit type hint")
	} else if len(parts) > 2 {
		return nil, errors.New("slash can be used only as type hint separator")
	}

	if tag, err := getTag(parts[1], val); err == nil {
		return &Prop{tag, parts[0], val}, nil
	} else {
		return nil, err
	}
}

func (p *Prop) Val() string {
	switch p.tag {
	case STRING:
		return `"` + p.val + `"`
	default:
		return p.val
	}
}

func (p *Prop) Key() string {
	return p.key
}

type StatementBuilder interface {
	Build() string
}

type UpdateBuilder struct {
	id string
	props []*Prop
	errs []error
}

type InsertBuilder struct {
	props []*Prop
	errs []error
}

func NewStatement(descriptor string, rawProps map[string]string) (StatementBuilder, error) {
	oid := strings.Split(descriptor, ":")
	if len(oid) != 2 {
		return nil, errors.New("entity descriptor must contain exactly 1 colon")
	}

	if rawProps["id"] == "" {
		return NewInsertBuilder(descriptor, rawProps)
		props, errs := makeProps(rawProps)
		return &InsertBuilder{

		}
	} else {
		id := rawProps["id"]
		delete(rawProps, "id")
		props, errs := makeProps(rawProps)
		return &UpdateBuilder{
			props: props,
			errs: errs,
		}
	}

	// Создать массив из корректно составленных properties.
	statement.props = make([]Prop, 0, len(rawProps))
	for propName, propValue := range rawProps {
		prop, err := NewProp(propName)
		if err == nil {
			statement.props = append(statement.props, prop)
		} else {
			echo.ClientError.println(err)
		}
	}

	return statement, nil
}

// makeProps производит разбор коллекции строк, которые, скорее всего,
// приходят от клиентов.
// Во время разбора может произойти {0, len(rawProps)} ошибок.
func makeProps(rawProps map[string]string) ([]Props, []errors {
	props := make([]Prop, 0, len(rawProps))
	var errs []error // Мы не знаем, сколько ошибок возникнет (может быть, ни одной?)

	for propName, propValue := range rawProps {
		prop, err := NewProp(propName)
		if err == nil {
			props[len(statement)-1] = prop
		} else {
			echo.ClientError.println(err)
			errs = append(errs, err)
		}
	}

	return props, errs
}

func NewInsertBuilder(name string, rawProps map[string]string) (*InsertBuilder, error) {

}
*/
