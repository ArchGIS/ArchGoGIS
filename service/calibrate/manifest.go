// Calibrate radiocarbons
package calibrate

import (
	"fmt"
	"net/http"
	"os/exec"

	"os"

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
	fmt.Fprintf(w, "Hi! This is an example service")

	err := os.Chdir("~/calibrator/bin")
	if err != nil {
		w.Write([]byte(err.Error()))
	}
	out, err := exec.Command("./calibrator", "-j", r.FormValue("dates")).Output()
	if err != nil {
		w.Write([]byte(err.Error()))
	}

	w.Write(out)
})
