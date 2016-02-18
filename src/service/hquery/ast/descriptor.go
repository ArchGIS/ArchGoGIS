package ast

func (my *Descriptor) HasRelations() bool {
	return my.Ops != nil
}
