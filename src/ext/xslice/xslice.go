package xslice

func IndexString(elts []string, needle string) int {
	for index, elt := range elts {
		if elt == needle {
			return index
		}
	}

	return -1
}
