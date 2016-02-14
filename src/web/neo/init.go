package neo

import (
	"cfg"
	"encoding/base64"
	"web/req"
)

var agent *req.Agent

const endpoint = cfg.NeoHost + "db/data/transaction/commit/"

func generateAuthString() string {
	authString := base64.StdEncoding.EncodeToString(
		[]byte(cfg.NeoUserName + ":" + cfg.NeoPassword),
	)

	return authString
}

func init() {
	agent = req.NewAgent(map[string][]string{
		"Accept":        {"application/json; charset=UTF-8"},
		"Authorization": {"Basic " + generateAuthString()},
		"Content-type":  {"application/json"},
	})
}
