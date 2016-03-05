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
		for tag, slots := range this.input {
			totalSlots += len(slots)
			if totalSlots > cfg.HqueryMaxPropsTotal {
				return nil, errs.BatchTooManyProps
			}

			if err := inputError(tag, slots); err != nil {
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
	for tag, slots := range my.input {
		if err := my.parseOne(tag, slots); err != nil {
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

func (my *Parser) parseOne(tag string, slots []string) error {
	if strings.Contains(tag, "_") {
		return my.parseEdge(tag, slots)
	} else {
		return my.parseNode(tag, slots)
	}
}

func (my *Parser) parseNode(tag string, slots []string) error {
	node, err := ast.NewNode(tag, slots)
	if err != nil {
		return err
	}

	my.nodes[node.Name] = node

	return nil
}

func (my *Parser) parseEdge(tag string, slots []string) error {
	edge, err := ast.NewEdge(tag, slots)
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
