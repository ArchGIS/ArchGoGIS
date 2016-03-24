package pfs

import (
	"cfg"
	"service/pfs/local"
	"storage"
)

var agent storage.FileStorage

func init() {
	switch cfg.PfsMain {
	case cfg.PfsLocal:
		agent = local.NewFileStorage("./fs/local_storage/")
	case cfg.PfsAmazonS3:
		panic("not implemented")

	default:
		panic("unknown PfsMain value")
	}
}
