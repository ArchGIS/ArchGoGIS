'use strict';

App.views.download = new (Backbone.View.extend({
  'index': function() {

    let queries = {

      Monument: {
        main: JSON.stringify({
          "Monument:Monument": {"id": "*", "select": "*"},
          "know:Knowledge": {"id": "*", "filter": "monument_name=FILTER=text"},
          "know__belongsto__Monument": {},
        }),

        needCulture: JSON.stringify({
          "Monument:Monument": {"id": "*", "select": "*"},
          "know:Knowledge": {"id": "*", "filter": "monument_name=FILTER=text"},
          "cul:Culture": {"id": "?", "filter": "name=CFIL=text"},
          "know__belongsto__Monument": {},
          "know__has__cul": {},
        }),

        additional: {
          know: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "know:Knowledge": {"id": "*", "select": "*"},
            "know__belongsto__mon": {},
          }),
          cul: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "know:Knowledge": {"id": "*"},
            "cul:Culture": {"id": "*", "select": "*"},
            "know__belongsto__mon": {},
            "know__has__cul": {},
          }),
          coords: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "mon__has__sp": {},
            "sp__has__spt": {},
          }),
          type: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "type:MonumentType": {"id": "*", "select": "*"},
            "mon__has__type": {},
          }),
          epoch: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "epoch:Epoch": {"id": "*", "select": "*"},
            "mon__has__epoch": {},
          }),
        }
      },

      Artifact: {
        main: JSON.stringify({
          "Artifact:Artifact": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        needCulture: JSON.stringify({
          "Artifact:Artifact": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
          "cul:Culture": {"id": "*", "filter": "name=CFIL=text"},
          "Artifact__has__cul": {},
        }),

        additional: {
          categ: JSON.stringify({
            "arti:Artifact": {"id": "NEED"},
            "categ:ArtifactCategory": {"id": "*", "select": "*"},
            "arti__has__categ": {},
          }),
          coll: JSON.stringify({
            "arti:Artifact": {"id": "NEED"},
            "inter:StorageInterval": {"id": "*"},
            "coll:Collection": {"id": "*", "select": "*"},
            "arti__has__inter": {},
            "coll__has__inter": {},
          }),
          know: JSON.stringify({
            "arti:Artifact": {"id": "NEED"},
            "know:Knowledge": {"id": "*", "select": "*"},
            "know__found__arti": {},
          }),
          coords: JSON.stringify({
            "arti:Artifact": {"id": "NEED"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "arti__has__sp": {},
            "sp__has__spt": {},
          }),
          exc: JSON.stringify({
            "arti:Artifact": {"id": "NEED"},
            "exc:Excavation": {"id": "*", "select": "*"},
            "exc__has__arti": {},
          })
        }
      },

      Heritage: {
        main: JSON.stringify({
          "Heritage:Heritage": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        needCulture: JSON.stringify({
          "Heritage:Heritage": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          coords: JSON.stringify({
            "h:Heritage": {"id": "NEED"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "h__has__sp": {},
            "sp__has__spt": {},
          }),
        }
      },
    }

    let fields = {

      Monument: {
        "id": "id",
        "Название": "know",
        "Тип": "type",
        "Эпоха": "epoch",
        "Культура": "cul",
        "Координаты": "coords",
      },
      Artifact: {
        "id": "id",
        "Название": "name",
        "Категория": "categ",
        "Год находки": "year",
        "Памятник": "know",
        "Раскоп": "exc",
        "Координаты": "coords",
      },

      Heritage: {
        "id": "id",
        "Название": "name",
        "Адрес": "address",
        "Датировка": "date",
        "Координаты": "coords",
      },
    }

    $("#show-button").on("click", function() {
      let entity = $("#entity-selector").val();
      let name = $("#entity-name-input").val();
      let cfil = $("#entity-culture-input").val();
      let query;

      let data = {};
      let tmp = [];
      let model = App.models.fn;

      let render = function() {
        _.each(tmp[0], function(collection, name) {
          _.each(collection, function(obj, t) {
            if (name == "know") {
              console.log(obj)
              data[entity][t][name] = _.pluck(obj, "monument_name").join(", ");
            } else if (name == "coords") {
              let coords = App.fn.findActualSpatref(obj.sp, obj.spt);
              if (coords.x) {
                data[entity][t][name] = `N: ${coords.x}, E: ${coords.y}`;
              }
            } else {
              data[entity][t][name] = _.pluck(obj, "name").join(", ");
            }
          })
        })

        let $results = $("#results");
        let $headers = $("#headers");

        $headers.html("");
        $results.html("");

        _.each(fields[entity], function(val, key) {
          let header = key;
          
          header = (header == "red") ? "" : header;
          header = (header == "del") ? "" : header;

          $headers.append(`
            <th>${header}</th>
          `)  
        })
        
        _.each(data[entity], function(row, key) {
          let html = "";
          _.each(fields[entity], function(val, key) {
            if (val == "red") {
              html += `<td><a href="#${entity.toLowerCase()}/show/${row.id}">Редактировать</a></td>`
            } else if (val == "del") {
              html += `<td><a class="entity-delete" data-entity="${entity}" data-id="${row.id}">Удалить</a></td>`
            } else {
              row[val] = row[val] || "";
              html += `<td>${row[val]}</td>`
            }
          })
          $results.append(`<tr>${html}</tr>`)
        })

        $(".entity-delete").on("click", function(e) {
          let entity = $(this).attr("data-entity");
          let id = $(this).attr("data-id");

          App.models.fn.deleteNode(entity, id);
          $($(this).parents("tr")[0]).detach();
        });

        console.log(data)
      }

      let queryCounter = _.size(queries[entity].additional) + 1;
      let callRender = _.after(queryCounter, render);

      if (cfil) {
        query = queries[entity].needCulture;
        query = query.replace(/CFIL/g, cfil);
      } else {
        query = queries[entity].main;
      }

      query = query.replace(/FILTER/g, name);

      $.when(model.sendQuery(query, 1500)).then(function(response) {
        _.extend(data, response);

        data[entity] = _.filter(data[entity], function(val) {
          return (val.id > 0);
        });
        data[entity] = _.uniq(data[entity], function(val) {
          return val.id;
        });

        console.log(_.uniq(data[entity]))

        let ids = _.map(data[entity], function(res) {return res.id.toString()});

        tmp.push(model.getData(queries[entity].additional, callRender, true, ids));
        callRender();
      })
    })
  }
}))