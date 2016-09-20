package norm

import (
	"testing"
)

type Case struct {
	in, want string
}


func iterateCases(cases []Case, f func(string) string, t *testing.T) {
	for _, c := range cases {
		got := f(c.in)

		if got != c.want {
			t.Errorf("Normal(%q) == %q, want %q", c.in, got, c.want)
		}
	}
}

func TestNormalMonument(t *testing.T) {
	cases := []Case{
		{"HELLO", "Hello"},
		{"say MY", "Say My"},
		{"\t Spaces \t\n", "Spaces"},
		{"Spaces\t\t In  Between", "Spaces In Between"},
		{"ПамятнИК ДОстоевского", "Памятник Достоевского"},
		{"Monument II", "Monument II"},
		{"Monument Xl", "Monument XI"},
		{"I Am", "I Am"},
		{"", ""},
	}

	iterateCases(cases, NormalMonument, t)
}

func TestNormalPerson(t *testing.T) {
	cases := []Case{
		{"фархуллин делюс ильшатович", "Фархуллин Делюс Ильшатович"},
		{" \tфархуллин ДЕЛюс  \n иЛьшатовИч", "Фархуллин Делюс Ильшатович"},
		{"фархуллин д.и.", "Фархуллин Д.И."},
		{"\t\n фархуллин \n д.   и. \n\t", "Фархуллин Д.И."},
		{"фархуллин д .  и . ", "Фархуллин Д.И."},
		{"gerald jay", "Gerald Jay"},
		{"\t GERALD \n jAY ", "Gerald Jay"},
		{"", ""},
	}

	iterateCases(cases, NormalPerson, t)
}

func TestValidatePersonName(t *testing.T) {
	cases := []Case{
		{"hello", ""},
		{"Фархуллин Делюс Ильшатович", ""},
		{"Stan Lee", ""},
		{"fsd ()", "not valid character"},
		{"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа", "too long string"},
		{"Dan Brown Wolf Much Better Captain", "count of name parts too much"},
	}

	iterateCases(cases, ValidatePersonName, t)
}

func TestValidateMonumentName(t *testing.T) {
	cases := []Case{
		{"hello fddf", ""},
		{"Петропавловская крепость", ""},
		{"Mogilnik na Volge", ""},
		{"fsd 9*", "not valid character"},
		{"аааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа", "too long string"},
	}

	iterateCases(cases, ValidateMonumentName, t)
}