package neo

import (
	"db/neo/errs"
	"echo"
	"encoding/json"
)

func newResponse(input []byte) (*Response, error) {
	echo.Info.Print(string(input))
	result := &Response{}
	echo.Info.Print(string(input))
	err := json.Unmarshal(input, result)

	return result, err
}

func tryNewResponse(responseText []byte, err error) (*Response, error) {
	if err == nil {
		resp, err := newResponse(responseText)
		if err != nil {
			echo.ServerError.Print(err)
			return nil, errs.InvalidResponse
		}

		if len(resp.Errors) > 0 {
			for _, err := range resp.Errors {
				echo.ServerError.Print(err)
			}

			return nil, errs.InvalidResponse
		}

		return resp, nil
	} else {
		return nil, err
	}
}
