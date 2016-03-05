package ext

import (
	"bytes"
	"fmt"
)

func (my *Xbuf) WriteStringf(format string, a ...interface{}) {
	fmt.Fprintf(my, format, a...)
}

func (my *Xbuf) WriteCsvStrings(parts []string, yielder func(string) string) {
	for _, part := range parts {
		my.WriteString(yielder(part))
		my.WriteByte(',')
	}
	my.dropLastByte()
}

func (my *Xbuf) dropLastByte() {
	my.Truncate(my.Len() - 1)
}
