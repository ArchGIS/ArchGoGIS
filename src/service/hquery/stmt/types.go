package stmt

type Update string
type Insert string

type Relation struct {
	Lhs   string
	Rhs   string
	query string
}
