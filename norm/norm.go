package norm

import (
	"regexp"
	"strings"
	"unicode/utf8"
)

const (
	// MaxLength is constraint for names of things
	MaxLength = 60
)

// NormalMonument normalize monuments name
func NormalMonument(input string) string {
	slice := strings.Fields(input)

	// Приведение обычных слов к нормальному виду, в римских цифрах меняется только 'l'=>'I'
	for i, v := range slice {
		if !isRomeNumber(v) {
			slice[i] = standartNormal(v)
		} else if strings.ContainsRune(v, 'l') {
			num := v
			num = strings.Replace(num, "l", "I", -1)
			slice[i] = num
		}
	}

	result := strings.Join(slice, " ")

	return result
}

func isRomeNumber(input string) bool {
	const alphabet = "lIVXLCDM"
	isRN := true

	for _, ch := range input {
		if !strings.ContainsRune(alphabet, ch) {
			isRN = false
			break
		}
	}

	return isRN
}

// Стандартная нормализация: hELlo => Hello
func standartNormal(val string) string {
	word := strings.ToLower(val)
	word = strings.Title(word)
	return word
}

// NormalPerson normalize persons name
func NormalPerson(input string) string {
	words := strings.Fields(input)
	slice := make([]string, 0)
	short := ""
	countOfShorts := 0

	for _, v := range words {
		if utf8.RuneCountInString(v) == 1 {
			short += v
			countOfShorts++
			continue
		}

		if strings.ContainsRune(v, '.') {
			short += v
			countOfShorts++
		} else {
			slice = append(slice, standartNormal(v))
		}
	}

	result := strings.Join(slice, " ")

	if countOfShorts > 0 {
		result += " " + strings.ToUpper(short)
	}

	return result
}

// ValidatePersonName returns empty string if ok
func ValidatePersonName(name string) string {
	const N = 4
	re := regexp.MustCompile("^[^\\sa-zA-Zа-яА-Я-]+$")

	if utf8.RuneCountInString(name) > MaxLength {
		return "too long string"
	}

	words := strings.Fields(name)

	if len(words) > N {
		return ("count of name parts too much")
	}

	for _, v := range words {
		if re.MatchString(v) {
			return ("not valid character")
		}
	}

	return ""
}

// ValidateMonumentName returns empty string if ok
func ValidateMonumentName(name string) string {
	if utf8.RuneCountInString(name) > MaxLength {
		return ("too long string")
	}

	re := regexp.MustCompile("[^\\sa-zA-Zа-яА-Я0-9-]+$")
	words := strings.Fields(name)

	for _, v := range words {
		if re.MatchString(v) {
			return ("not valid character")
		}
	}

	return ""
}