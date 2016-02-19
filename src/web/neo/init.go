package neo

import (
	"cfg"
	"encoding/base64"
	"web/req"
)

var agent *req.Agent

const (
	txEndpoint = cfg.NeoHost + "db/data/transaction/"
	endpoint   = txEndpoint + "commit/"
)

func init() {
	authString := base64.StdEncoding.EncodeToString(
		[]byte(cfg.NeoUserName + ":" + cfg.NeoPassword),
	)

	agent = req.NewAgent(map[string][]string{
		"Accept":        {"application/json; charset=UTF-8"},
		"Authorization": {"Basic " + authString},
		"Content-type":  {"application/json"},
	})
}
