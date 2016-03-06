package read

import (
	"cfg"
	"echo"
	"encoding/json"
	"io"
	"service/hquery/errs"
	"service/hquery/read/ast"
	"strings"
)

func NewParser(input io.ReadCloser) (*Parser, error) {
	this := &Parser{}
	err := json.NewDecoder(input).Decode(&this.input)

	if err == nil {
		switch {
		case len(this.input) > cfg.HqueryMaxEntries:
			return nil, errs.TooManyEntries
		case len(this.input) == 0:
			return nil, errs.EmptyInput
		}

		totalSlots := 0
		for tag, query := range this.input {
			totalSlots += len(query)
			if totalSlots > cfg.HqueryMaxPropsTotal {
				return nil, errs.BatchTooManyProps
			}

			if err := inputError(tag, query); err != nil {
				return nil, err
			}
		}

		this.nodes = make(map[string]*ast.Node, len(this.input))
		this.edges = make([]*ast.Edge, 0, len(this.input))

		return this, nil
	} else {
		echo.ClientError.Print(err)
		return nil, errs.BadJsonGiven
	}
}

func (my *Parser) parse() error {
	for tag, query := range my.input {
		if err := my.parseOne(tag, query); err != nil {
			return err
		}
	}

	for _, edge := range my.edges {
		if !(my.hasRef(edge.Lhs) && my.hasRef(edge.Rhs)) {
			return errs.EdgeMissingRef
		}
	}

	return nil
}

func (my *Parser) parseOne(tag string, query map[string]string) error {
	if strings.Contains(tag, "_") {
		return my.parseEdge(tag, query)
	} else {
		return my.parseNode(tag, query)
	}
}

func (my *Parser) parseNode(tag string, query map[string]string) error {
	node, err := ast.NewNode(tag, query)
	if err != nil {
		return err
	}

	my.nodes[node.Name] = node

	return nil
}

func (my *Parser) parseEdge(tag string, query map[string]string) error {
	edge, err := ast.NewEdge(tag, query)
	if err != nil {
		return err
	}

	my.edges = append(my.edges, edge)

	return nil
}

func (my *Parser) hasRef(key string) bool {
	_, has := my.nodes[key]
	return has
}
