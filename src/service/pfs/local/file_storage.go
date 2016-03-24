package local

import (
	"db/pg/seq"
	"io/ioutil"
	"web/server"
)

func NewFileStorage(dstDir string) LocalStorage {
	return LocalStorage{dstDir}
}

func (my LocalStorage) Save(data []byte) (string, error) {
	key, err := seq.NextString("local_storage_file_id_seq")
	if err != nil {
		return "", err
	}

	return key, ioutil.WriteFile(my.dstDir+key, data, 0644)
}

func (my LocalStorage) Load(key string) ([]byte, error) {
	return ioutil.ReadFile(my.dstDir + key)
}

func (my LocalStorage) Url(key string) (string, error) {
	return "http://" + server.GetHost() + "/local_storage/" + key, nil
}
