package req

import (
	"assert"
	"io/ioutil"
	"net/http"
	"testing"
)

var testSitePageSize int

const (
	testUrl = "http://example.com/"
)

func init() {
	// С помощью стандартной библиотеки достанем данные
	// для проверки результатов.
	response, err := http.Get(testUrl)
	assert.Nil(err).NotNil(response)
	defer response.Body.Close()

	content, err := ioutil.ReadAll(response.Body)
	assert.Nil(err)

	testSitePageSize = len(content)
}

func TestSimpleGet(t *testing.T) {
	content, err := NewAgent(nil).Get(testUrl, nil)

	if err == nil {
		if size := len(content); size != testSitePageSize {
			t.Errorf(
				"expected %d bytes len(content), got %d",
				testSitePageSize,
				size,
			)
		}
	}
}
