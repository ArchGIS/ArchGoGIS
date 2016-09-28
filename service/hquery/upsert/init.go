package upsert

import (
	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/service/pfs/local"
	"github.com/ArchGIS/ArchGoGIS/storage"
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
