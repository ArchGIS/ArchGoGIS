package stmt

import (
	"service/hquery/ast"
)

func (my Update) yieldProp(prop *ast.Prop) string {
	return my.descriptor.Name + "." + prop.Key + "=" + prop.Val
}

func (my Update) yieldResult(body string) string {
	return "MATCH (" + my.descriptor.Full + " {id:" + my.id + "})\nSET " + body + " RETURN 1"
}
