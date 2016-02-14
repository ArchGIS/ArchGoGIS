// Обёртка над стандартной библитекой, позволяет делать запросы
// с меньшим количеством строк кода. Заточена под местную кодовую базу.
//
// Использует http.DefaultClient, но может быть временным решением
// (когда будет принято решение отказаться от http.DefaultClient,
// публичное API пакета затронуто не будет).
package req

import (
	"echo"
	"io"
	"io/ioutil"
	"net/http"
)

// NewRequest создаёт объект http.Request с дополнительной инициализацией.
func (my *Agent) NewRequest(method, url string, data []byte) (*http.Request, error) {
	request, err := NewRequest(method, url, data)
	if err != nil {
		return nil, err
	}

	// На данный момент мы "дополнительно инициализируем" только заголовки.
	request.Header = my.headers

	return request, nil
}

func (my *Agent) Get(url string, data []byte) ([]byte, error) {
	return my.Send("GET", url, data)
}

func (my *Agent) Post(url string, data []byte) ([]byte, error) {
	return my.Send("POST", url, data)
}

func (my *Agent) Delete(url string, data []byte) ([]byte, error) {
	return my.Send("DELETE", url, data)
}

func (my *Agent) Send(method, url string, data []byte) ([]byte, error) {
	request, err := my.NewRequest(method, url, data)
	if err != nil {
		return nil, err
	}

	response, err := my.client.Do(request)
	if err != nil || response == nil {
		return nil, err
	}
	defer response.Body.Close()

	content, readErr := ioutil.ReadAll(response.Body)
	if readErr != nil {
		// Если где-то в чтении возникла ошибка.
		// Нам нужно полностью опустошить Body ответа.
		_, err = io.Copy(ioutil.Discard, response.Body)
		if err != nil {
			// Что-то совсем невероятное!
			echo.ServerError.Print("failed to discard response body")
		}

		// Непосредственно ошибку чтения передаём на уровень выше.
		return nil, readErr
	}

	return content, nil
}
