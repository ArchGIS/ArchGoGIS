package hquery

import (
	"errors"
)

func descriptorLengthErr() error {
	return errors.New("descriptor max length is 32")
}

func descriptorPatternErr(badDescriptor string) error {
	return errors.New(badDescriptor + " is not a valid descriptor")
}

func multipleArrowsErr() error {
	return errors.New("only one `->` operator is allowed inside label")
}

func noTypeHintErr() error {
	return errors.New("only `id` property can omit type hint")
}

func multipleSlashesErr() error {
	return errors.New("too many slashes in property name")
}

func badPropNameErr() error {
	return errors.New("bad property name")
}

func badTypeHintErr(badType string) error {
	return errors.New("type `" + badType + "` is not supported")
}
