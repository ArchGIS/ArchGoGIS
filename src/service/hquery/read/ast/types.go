package ast

type Matcher string

type Node struct {
	Tag      string
	Name     string
	Labels   string
	Matcher  Matcher
	Selected bool
}

type Edge struct {
	Tag      string
	Lhs      string
	Rhs      string
	Type     string
	Selected bool
}
