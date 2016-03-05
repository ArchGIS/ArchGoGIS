package ast

type Node struct {
	Tag    string
	Name   string
	Labels string
	Props  map[string]string
}

type Edge struct {
	Lhs   string
	Rhs   string
	Type  string
	Props map[string]string
}
