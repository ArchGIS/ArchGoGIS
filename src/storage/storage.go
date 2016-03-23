package storage

import (
	"cfg"
	"echo"
	"io/ioutil"
)

const (
	STORAGE_PATH = "./fs/local_storage/"
)

func (lst LocalStorage) Save(key string, data []byte) error {
	echo.Info.Print("write at", STORAGE_PATH+key)
	var err = ioutil.WriteFile(STORAGE_PATH+key, data, 0777)

	return err
}

func (lst LocalStorage) Load(key string) ([]byte, error) {
	file, err := ioutil.ReadFile(STORAGE_PATH + key)

	return file, err
}

func (lst LocalStorage) Url(key string) (string, error) {
	// err := os.IsExist(STORAGE_PATH + key)
	Url := cfg.Neo.Host + STORAGE_PATH + key

	return Url, nil
}
