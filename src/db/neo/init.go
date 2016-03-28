package neo

import (
	"cfg"
	"encoding/base64"
	"web/req"
)

var agent *req.Agent

var (
	txEndpoint string
	endpoint   string
)

func init() {
	txEndpoint = cfg.Neo.Host + "db/data/transaction/"
	endpoint = txEndpoint + "commit/"

	authString := base64.StdEncoding.EncodeToString(
		[]byte(cfg.Neo.UserName + ":" + cfg.Neo.Password),
	)

	agent = req.NewAgent(map[string][]string{
		"Accept":        {"application/json; charset=UTF-8"},
		"Authorization": {"Basic " + authString},
		"Content-type":  {"application/json"},
	})
}
