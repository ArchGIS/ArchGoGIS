// Calibrate radiocarbons
package calibrate

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"

	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	ServiceName: "calibrate",
	Routes: []web.Route{
		{"/", calibrate},
	},
}

var calibrate = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, ">>> Service for radiocarbon dates <<<")

	var mock = `
		R_DATE("qwerr", 2000, 24);
	`
	err := os.Chdir("~/OxCal/bin")

	file, err := os.Open("test.oxcal")
	if err != nil {
		w.Write([]byte(err.Error()))
	}
	defer file.Close()
	file.WriteString(mock)

	_, err = exec.Command("./OxCalLinux", "test.oxcal").Output()
	if err != nil {
		w.Write([]byte(err.Error()))
	}

	resFile, err := ioutil.ReadFile("test.js")
	if err != nil {
		w.Write([]byte(err.Error()))
	}

	w.Write(resFile)
})
