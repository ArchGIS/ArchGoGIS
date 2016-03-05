package ext

type StringWriter interface {
	WriteString(s string) (n int, err error)
}

type Byter interface {
	Bytes() []byte
}

type Xbuf struct {
	bytes.Buffer
}
