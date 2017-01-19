package local

import (
	"io/ioutil"

	"github.com/ArchGIS/ArchGoGIS/db/pg/seq"
	"github.com/ArchGIS/ArchGoGIS/cfg"
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
	return "http://" + cfg.DevServer().Host + "/local_storage/" + key, nil
}
