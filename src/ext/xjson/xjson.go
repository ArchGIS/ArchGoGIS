package xjson

import (
	"encoding/json"
	"throw"
)

type Object map[string][]interface{}

func Merge(from, to Object) Object {
	for key, props := range from {
		for propKey, propVal := range props {
			to[key][propKey] = propVal
		}
	}

	return to
}

func MustDecode(rawJson []byte) Object {
	var object Object
	throw.Error(json.Unmarshal(rawJson, &object))

	return object
}

func MustEncode(object Object) []byte {
	rawJson, err := json.Marshal(object)
	throw.Error(err)

	return rawJson
}
