package neo

import (
	"encoding/json"
)

func newResponse(input []byte) (*Response, error) {
	result := &Response{}
	err := json.Unmarshal(input, result)

	return result, err
}

func tryNewResponse(responseText []byte, err error) (*Response, error) {
	if err == nil {
		return newResponse(responseText)
	} else {
		return nil, err
	}
}
