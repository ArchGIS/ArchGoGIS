package req

import (
	"bytes"
	"net/http"
)

// Агент передаёт запросы http клиенту, предварительно заполняя их
// требуемыми данными. Он позволяет выполнять множество однотипных запросов
// минуя необходимости постоянно задавать одни и те же заголовки.
type Agent struct {
	client  *http.Client
	headers http.Header
}

func NewAgent(headers http.Header) *Agent {
	return &Agent{
		client:  http.DefaultClient,
		headers: headers,
	}
}

// NewRequest создаёт новый http.Request объект, инициализированный
// байтовым буфером.
func NewRequest(method, url string, data []byte) (*http.Request, error) {
	if nil != data {
		return http.NewRequest(method, url, bytes.NewBuffer(data))
	} else {
		return http.NewRequest(method, url, nil)
	}
}
