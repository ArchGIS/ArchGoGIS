package stmt

import (
	"service/hquery/ast"
)

func (my Relation) yieldProp(prop *ast.Prop) string {
	return prop.Key + ":" + prop.Val
}

func (my Relation) yieldResult(body string) string {
	lhs, rhs := my.descriptor.Ops.Lhs, my.descriptor.Ops.Rhs

	if body == "" {
		return "CREATE (" + lhs + ")-[:" + my.descriptor.Label + "]->(" + rhs + ")"
	} else {
		return "CREATE (" + lhs + ")-[:" + my.descriptor.Label + " {" + body + "}]->(" + rhs + ")"
	}
}
