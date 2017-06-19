// Calibrate radiocarbons
package calibrate

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"regexp"

	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	ServiceName: "calibrate",
	Routes: []web.Route{
		{"/", calibrate},
	},
}

const (
	path = "/home/archgis/OxCal/bin/"
)

var calibrate = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	buff := new(bytes.Buffer)
	buff.ReadFrom(r.Body)
	reqBody := buff.Bytes()

	file, err := os.Open(path + "test.oxcal")
	if err != nil {
		w.Write([]byte("First " + err.Error()))
	}
	defer file.Close()
	file.Write(reqBody)

	err = exec.Command(path+"OxCalLinux", path+"test.oxcal").Run()
	if err != nil {
		w.Write([]byte("Second " + err.Error()))
	}

	resFile, err := ioutil.ReadFile(path + "test.js")
	if err != nil {
		w.Write([]byte("Third " + err.Error()))
	}

	re := regexp.MustCompile(`ocd\[1\].likelihood.start=(-?\d*.?\d*)`)
	matched := re.Find(resFile)
	res := bytes.Split(matched, []byte("="))[1]

	var buf ext.Xbuf

	buf.WriteByte('{')
	buf.Write([]byte("start:"))
	buf.Write(res)
	buf.WriteByte(',')

	re = regexp.MustCompile(`ocd\[1\].likelihood.prob=(\[.*\])`)
	matched = re.Find(resFile)
	res = bytes.Split(matched, []byte("="))[1]

	buf.WriteString("prob:")
	buf.Write(res)
	buf.WriteByte('}')

	w.Write(buf.Bytes())
})
