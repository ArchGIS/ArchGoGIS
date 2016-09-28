package echo

import (
	"log"
	"os"
)

var (
	Info        Logger // Информационный поток
	Warning     Logger // Что-то подозрительное на стороне сервера
	ServerError Logger // Ошибка на стороне сервера. Что-то ужасное
	ClientError Logger // Ошибка со стороны клиента, ничего страшного
	VendorError Logger // Неожиданное поведение со стороны библиотеки
)

func init() {
	var flags = log.Ldate | log.Ltime | log.Lshortfile

	Info = Logger{log.New(os.Stdout, "{Info} ", flags)}
	Warning = Logger{log.New(os.Stdout, "{Warning} ", flags)}
	ServerError = Logger{log.New(os.Stderr, "{ServerError} ", flags)}
	ClientError = Logger{log.New(os.Stdout, "{ClientError} ", flags)}
	VendorError = Logger{log.New(os.Stderr, "{VendorError} ", flags)}
}
