package upsert

import (
	"cfg"
	"echo"
	"encoding/json"
	"io"
	"service/hquery/errs"
	"service/hquery/upsert/ast"
	"strings"
)

func NewParser(input io.ReadCloser) (*Parser, error) {
	this := &Parser{}
	err := json.NewDecoder(input).Decode(&this.input)

	if len(this.input) > cfg.HqueryMaxEntries {
		return nil, errs.TooManyEntries
	}

	if err == nil {
		totalProps := 0
		for tag, rawProps := range this.input {
			totalProps += len(rawProps)
			if totalProps > totalProps {
				return nil, errs.BatchTooManyProps
			}

			if err := inputError(tag, rawProps); err != nil {
				return nil, err
			}
		}

		// Производим аллокации только если успешно выполнился decode
		// и предварительные проверки.
		// Выделяем [возможно] больше памяти, чем нужно, зато гарантированно
		// задаём максимально возможный capacity
		this.nodeInserts = make(map[string]*ast.Node, len(this.input))
		this.nodeUpdates = make(map[string]*ast.Node, len(this.input))
		this.edgeInserts = make([]*ast.Edge, 0, len(this.input))
		this.edgeUpdates = make([]*ast.Edge, 0, len(this.input))

		return this, nil
	} else {
		echo.ClientError.Print(err)
		return nil, errs.BadJsonGiven
	}
}

func (my *Parser) parse() error {
	for tag, rawProps := range my.input {
		if err := my.parseOne(tag, rawProps); err != nil {
			return err
		}
	}

	for _, edge := range my.edgeInserts {
		if !(my.hasRef(edge.Lhs) && my.hasRef(edge.Rhs)) {
			return errs.EdgeMissingRef
		}
	}

	return nil
}

func (my *Parser) parseOne(tag string, rawProps map[string]string) error {
	arrows := strings.Count(tag, "->")
	if arrows > 1 {
		return errs.TagMultipleArrows
	}

	if arrows == 1 {
		return my.parseEdge(tag, rawProps)
	} else {
		return my.parseNode(tag, rawProps)
	}
}

func (my *Parser) parseNode(tag string, rawProps map[string]string) error {
	node, err := ast.NewNode(tag, rawProps)
	if err != nil {
		return err
	}

	if _, hasId := rawProps["id"]; hasId {
		my.nodeUpdates[node.Name] = node
	} else {
		my.nodeInserts[node.Name] = node
	}

	return nil
}

func (my *Parser) parseEdge(tag string, rawProps map[string]string) error {
	edge, err := ast.NewEdge(tag, rawProps)
	if err != nil {
		return err
	}

	if _, hasId := rawProps["id"]; hasId {
		my.edgeUpdates = append(my.edgeUpdates, edge)
	} else {
		my.edgeInserts = append(my.edgeInserts, edge)
	}

	return nil
}

func (my *Parser) hasRef(key string) bool {
	if _, hasRefInInserts := my.nodeInserts[key]; hasRefInInserts {
		return true
	}

	if _, hasRefInUpdates := my.nodeUpdates[key]; hasRefInUpdates {
		return true
	}

	return false
}
