package hquery

const (
	maxDescriptorLen = 32
	maxEntries       = 12
)

func validDescriptorLen(descriptor string) bool {
	return len(descriptor) <= maxDescriptorLen
}

func validPropName(name string) bool {
	// Идентификатор должен состоять только из Latin1 ASCII символов.
	// #FIXME: реализовать
	return true
}
