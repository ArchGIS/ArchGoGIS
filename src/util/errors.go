package util

func (my Errors) push(err error) {
	if err != nil {
		my = append(my, err)
	}
}
