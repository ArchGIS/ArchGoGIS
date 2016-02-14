package req

import (
	"bytes"
	"net/http"
)

// NewRequest создаёт новый http.Request объект, инициализированный
// байтовым буфером.
func NewRequest(method, url string, data []byte) (*http.Request, error) {
	if nil != data {
		return http.NewRequest(method, url, bytes.NewBuffer(data))
	} else {
		return http.NewRequest(method, url, nil)
	}
}
