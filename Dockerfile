FROM instructure/golang:1.7

# RUN mkdir -p $SRCPATH/gis-app

USER root
ADD . $SRCPATH/github.com/ArchGIS/ArchGoGIS
WORKDIR $SRCPATH/github.com/ArchGIS/ArchGoGIS
# RUN chown -R docker:docker .
# USER root
RUN go get github.com/lib/pq
RUN go install

EXPOSE 8080

CMD ArchGoGIS