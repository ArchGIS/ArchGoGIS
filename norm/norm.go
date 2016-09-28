package norm

import (
	"strings"
	"unicode"
	"unicode/utf8"
)

func Capitalize(subject string) string {
	ch, width := utf8.DecodeRuneInString(subject)
	return string(unicode.ToUpper(ch)) + strings.ToLower(subject[width:])
}

func Name(name string) string {
	spaceless := strings.TrimSpace(name)
	spacePos := strings.IndexByte(spaceless, ' ')

	if spacePos == -1 {
		return Capitalize(spaceless)
	} else {
		firstName := Capitalize(spaceless[:spacePos])
		initials := strings.Replace(strings.ToUpper(spaceless[spacePos:]), " ", "", -1)
		return firstName + " " + initials
	}
}
