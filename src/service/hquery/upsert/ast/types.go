package ast

type Node struct {
	Tag    string
	Name   string
	Labels string
	Props  []*Prop
}

type Edge struct {
	Lhs   string
	Rhs   string
	Label string
	Props []*Prop // Возможно стоит перейти на map[string]string
}

type Prop struct {
	Key string
	Val string
}
