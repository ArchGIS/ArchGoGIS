package echo

import (
	"log"
	"os"
)

var (
	Info        *log.Logger // Информационный поток
	Warning     *log.Logger // Что-то подозрительное на стороне сервера
	ServerError *log.Logger // Ошибка на стороне сервера. Что-то ужасное
	ClientError *log.Logger // Ошибка со стороны клиента, ничего страшного
	VendorError *log.Logger // Неожиданное поведение со стороны библиотеки
)

func init() {
	var flags = log.Ldate | log.Ltime | log.Lshortfile

	Info = log.New(os.Stdout, "{Info} ", flags)
	Warning = log.New(os.Stdout, "{Warning} ", flags)
	ServerError = log.New(os.Stderr, "{ServerError} ", flags)
	ClientError = log.New(os.Stdout, "{ClientError} ", flags)
	VendorError = log.New(os.Stderr, "{VendorError} ", flags)
}
