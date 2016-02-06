package handler

import (
	"echo"
	"encoding/json"
	"fmt"
	"hparse"
	"net/http"
	"web"
)

func HqueryUpsert(w web.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		echo.ClientError.Print(err)
		fmt.Fprintf(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()))
		// #FIXME: клиенту нужно вернуть какой-то код ошибки
	} else {
		results := handleUpsert(r.Form)
		encodedData, _ := json.Marshal(results)
		fmt.Fprintf(w, string(encodedData))
	}

	/*
		for entryName := range r.Form { // range over map
			value := r.Form[entryName][0]

			props := make(map[string]string)
			json.Unmarshal([]byte(value), &props)

			stmt := hparse.Statement(entryName, props)
			println(stmt)
		}
	*/
}

func jsonDecode(encodedData string) (map[string]string, error) {
	data := make(map[string]string)
	err := json.Unmarshal([]byte(encodedData), &data)
	return data, err
}

func handleUpsert(params map[string][]string) map[string]string {
	results := make(map[string]string, len(params))

	for paramName := range params {
		if len(params[paramName]) > 1 {
			msg := fmt.Sprintf("array-parameter %s rejected", paramName)
			echo.ClientError.Print(msg)
			results[paramName] = msg
			continue
		}

		encodedData := params[paramName][0] // Единственный интересующий нас элемент

		rawProps, err := jsonDecode(encodedData)
		if err == nil {
			// created или updated или сообщение об ошибке
			operationStatus := hparse.Eval(paramName, rawProps)
			echo.Info.Printf("%s: %s", paramName, operationStatus)
			results[paramName] = operationStatus
		} else {
			msg := fmt.Sprintf("%s json is malformed (%s)", paramName, err.Error())
			echo.ClientError.Print(msg)
			results[paramName] = msg
		}
	}

	return results
}
