package stmt

import (
	"service/hquery/ast"
)

type fields map[string]string

type yielder interface {
	yieldProp(prop *ast.Prop) string
	yieldResult(body string) string
}

type Update struct {
	descriptor *ast.Descriptor
	id         string
}

type Insert struct {
	descriptor *ast.Descriptor
}

type Relation struct {
	descriptor *ast.Descriptor
}
