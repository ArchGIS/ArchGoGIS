package tmpl

import (
	"echo"
	"html/template"
	"io"
)

var templates map[string]*template.Template

var (
	layout *template.Template
)

func initLayoutTmpl() {
	layout = template.Must(template.ParseFiles("public/view/layout.html"))
}

func Render(w io.Writer, templateName string, data interface{}) {
	t := templates[templateName]

	if t != nil {
		t.Execute(w, data)
	} else {
		// #FIXME: нужно ещё ошибку писать в html
		echo.ServerError.Printf("`%s` template not found", templateName)
	}
}

func init() {
	templates = make(map[string]*template.Template)
	initLayoutTmpl()

	tm := template.Must(layout.Clone())
	tm = template.Must(tm.ParseFiles("public/view/index.html"))
	templates["/"] = tm
}
