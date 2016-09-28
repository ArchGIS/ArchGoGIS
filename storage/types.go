package storage

type FileStorage interface {
	Save(data []byte) (string, error)
	Load(key string) ([]byte, error)
	Url(key string) (string, error)
}
