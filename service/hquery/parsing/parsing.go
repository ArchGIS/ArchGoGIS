package parsing

import (
	"encoding/json"
	"io"
	"strings"

	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/valid"
	"github.com/ArchGIS/ArchGoGIS/throw"
)

func MustDestructureNodeTag(tag string) (string, string) {
	labelSepPos := strings.IndexByte(tag, ':')
	throw.If(labelSepPos == -1, errs.TagLabelMissing)

	name, labels := tag[:labelSepPos], tag[labelSepPos+1:]
	throw.If(!valid.Identifier(name), errs.InvalidIdentifier)
	for _, label := range strings.Split(labels, ":") {
		throw.If(!valid.Identifier(label), errs.InvalidIdentifier)
	}

	return name, labels
}

func MustDestructureEdgeTag(tag string) (string, string, string) {
	parts := strings.Split(tag, "__")
	throw.If(len(parts) != 3, errs.TagBadFormat)

	for _, part := range parts {
		throw.If(!valid.Identifier(part), errs.InvalidIdentifier)
	}

	return parts[0], parts[1], parts[2]
}

func MustFetchJson(reader io.ReadCloser) Tree {
	var input Tree
	throw.Guard(json.NewDecoder(reader).Decode(&input), func(err error) {
		echo.ClientError.Print(err)
		throw.Error(errs.BadJsonGiven)
	})

	throw.If(len(input) > cfg.HqueryMaxEntries, errs.TooManyEntries)
	throw.If(len(input) == 0, errs.EmptyInput)

	return input
}
