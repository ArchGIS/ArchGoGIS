package storage

type FileStorage interface {
	Save(key string, data []byte) error
	Load(key string) ([]byte, error)
	Url(key string) (string, error)
}

type LocalStorage struct{}

/*
1) реализовать LocalFileStorage
2) разобраться как работают сервисы на нашем сайте (если займёт больше 30 минут, обращайся ко мне)
3) написать сервис pfs (persistent file storage):
   /save
   /locate
   имеет static директорию local_storage
4) попробовать с клиента отправить файл на сервер (/pfs/save), сохранить его и далее
   по /pfs/locate получить url + по этому url скачать файл (или открыть его)
*/

// implement: LocalFileStorage
// save -- пишет на диск
// load -- читает файл с диска
// locate -- возвращает путь к файлу
