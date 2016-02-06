package req

import (
	"assert"
	"io/ioutil"
	"net/http"
)

func NewConnection(headerLines []HeaderLine) *Connection {
	conn := &Connection{}

	conn.Client = &http.Client{}
	conn.HeaderLines = headerLines

	return conn
}

func (conn *Connection) Send(method string, url string, data []byte) ([]byte, error) {
	request, err := newRequest(method, url, data)
	assert.PanicOnError(err)

	for _, headerLine := range conn.HeaderLines {
		request.Header.Set(headerLine.Key, headerLine.Value)
	}

	response, err := conn.Client.Do(request)
	assert.PanicOnError(err)
	defer response.Body.Close()

	return ioutil.ReadAll(response.Body)
}

func (conn *Connection) Post(url string, data []byte) ([]byte, error) {
	return conn.Send("POST", url, data)
}

func (conn *Connection) Get(url string, data []byte) ([]byte, error) {
	return conn.Send("GET", url, data)
}

func (conn *Connection) Delete(url string, data []byte) ([]byte, error) {
	return conn.Send("DELETE", url, data)
}
