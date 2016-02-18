package stmt

import (
	"service/hquery/ast"
)

func (my Insert) yieldProp(prop *ast.Prop) string {
	return prop.Key + ":" + prop.Val
}

func (my Insert) yieldResult(body string) string {
	return "CREATE (" + my.descriptor.Full + " {" + body + "})"
}
