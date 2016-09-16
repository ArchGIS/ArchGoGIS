package xl

func newResult(width, height int) Result {
	var result Result

	result.Header = make([]string, 0, width)
	result.Rows = make([][]string, height)
	for i := 0; i < height; i++ {
		result.Rows[i] = make([]string, 0, width)
	}

	return result
}
