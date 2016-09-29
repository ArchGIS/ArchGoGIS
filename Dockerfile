
FROM instructure/golang:1.7

# RUN mkdir -p $SRCPATH/gis-app

USER root
ADD . $SRCPATH/github.com/ArchGIS/ArchGoGIS

RUN go get github.com/lib/pq

WORKDIR $SRCPATH/github.com/ArchGIS/ArchGoGIS
# RUN chown -R docker:docker .
# USER root
RUN go install

CMD ArchGoGIS

