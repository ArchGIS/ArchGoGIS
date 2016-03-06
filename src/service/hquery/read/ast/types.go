package ast

type Node struct {
	Tag    string
	Name   string
	Labels string
	Props  map[string]string
}

type Edge struct {
	Tag   string
	Lhs   string
	Rhs   string
	Type  string
	Props map[string]string
}
