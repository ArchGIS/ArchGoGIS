'use strict';

App.views.admin = new (Backbone.View.extend({
  'main': function() {

    let queries = {
      Author: {
        main: JSON.stringify({
          "Author:Author": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          res: JSON.stringify({
            "author:Author": {"id": "NEED"},
            "researches:Research": {"id": "*", "select": "*"},
            "researches__hasauthor__author": {},
          }),
          org: JSON.stringify({
            "author:Author": {"id": "NEED"},
            "jobs:AuthorJob": {"id": "*"},
            "orgs:Organization": {"id": "*", "select": "*"},
            "author__has__jobs": {},
            "jobs__belongsto__orgs": {},
          })
        }
      },

      Research: {
        main: JSON.stringify({
          "Research:Research": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          type: JSON.stringify({
            "research:Research": {"id": "NEED"},
            "resType:ResearchType": {"id": "*", "select": "*"},
            "research__has__resType": {},
          }),
          report: JSON.stringify({
            "research:Research": {"id": "NEED"},
            "report:Report": {"id": "*", "select": "*"},
            "research__has__report": {},
          }),
          author: JSON.stringify({
            "research:Research": {"id": "NEED"},
            "author:Author": {"id": "*", "select": "*"},
            "research__hasauthor__author": {},
          })
        }
      },

      Monument: {
        main: JSON.stringify({
          "Monument:Monument": {"id": "*", "select": "*"},
          "know:Knowledge": {"id": "*", "filter": "monument_name=FILTER=text"},
          "know__belongsto__Monument": {},
        }),

        additional: {
          know: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "know:Knowledge": {"id": "*", "select": "*"},
            "know__belongsto__mon": {},
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
          res: JSON.stringify({
            "mon:Monument": {"id": "NEED"},
            "know:Knowledge": {"id": "*"},
            "res:Research": {"id": "*", "select": "*"},
            "know__belongsto__mon": {},
            "res__has__know": {},
          })
        }
      },

      Artifact: {
        main: JSON.stringify({
          "Artifact:Artifact": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
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
          })
        }
      },

      Radiocarbon: {
        main: JSON.stringify({
          "Radiocarbon:Radiocarbon": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      },

      Excavation: {
        main: JSON.stringify({
          "Excavation:Excavation": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          res: JSON.stringify({
            "exc:Excavation": {"id": "NEED"},
            "res:Research": {"id": "*", "select": "*"},
            "res__has__exc": {},
          }),
          know: JSON.stringify({
            "exc:Excavation": {"id": "NEED"},
            "mon:Monument": {"id": "*"},
            "res:Research": {"id": "*"},
            "know:Knowledge": {"id": "*", "select": "*"},
            "know__belongsto__mon": {},
            "res__has__know": {},
            "mon__has__exc": {},
            "res__has__exc": {},
          })
        }
      },

      Report: {
        main: JSON.stringify({
          "Report:Report": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          res: JSON.stringify({
            "rep:Report": {"id": "NEED"},
            "res:Research": {"id": "*", "select": "*"},
            "res__has__rep": {},
          }),
          author: JSON.stringify({
            "rep:Report": {"id": "NEED"},
            "author:Author": {"id": "*", "select": "*"},
            "rep__hasauthor__author": {},
          })
        }
      },

      Publication: {
        main: JSON.stringify({
          "Publication:Publication": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          author: JSON.stringify({
            "pub:Publication": {"id": "NEED"},
            "author:Author": {"id": "*", "select": "*"},
            "pub__hasauthor__author": {},
          })
        }
      },

      Heritage: {
        main: JSON.stringify({
          "Heritage:Heritage": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      },

      Epoch: {
        main: JSON.stringify({
          "Epoch:Epoch": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      },

      Culture: {
        main: JSON.stringify({
          "Culture:Culture": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      },

      Organization: {
        main: JSON.stringify({
          "Organization:Organization": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      },

      City: {
        main: JSON.stringify({
          "City:City": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),
      }
    }

    let fields = {
      Author: {
        "id": "id",
        "Имя": "name",
        "Организации": "org",
        "Исследования": "res",
        "red": "red",
        "del": "del"
      },
      Research: {
        "id": "id",
        "Название": "name",
        "Тип": "type",
        "Автор": "author",
        "Год": "year",
        "Отчет": "report",
        "red": "red",
        "del": "del"
      },
      Monument: {
        "id": "id",
        "Название": "know",
        "Тип": "type",
        "Эпоха": "epoch",
        "Исследования": "res",
        "red": "red",
        "del": "del"
      },
      Artifact: {
        "id": "id",
        "Название": "name",
        "Категория": "categ",
        "Год находки": "year",
        "Коллекции": "coll",
        "red": "red",
        "del": "del"
      },
      Radiocarbon: {
        "id": "id",
        "Индекс": "name",
        "Дата BP": "date",
        "red": "red",
        "del": "del"
      },
      Excavation: {
        "id": "id",
        "Название": "name",
        "Исследование": "res",
        "Руководитель раскопа": "boss",
        "Площадь": "area",
        "Памятник": "know",
        "red": "red",
        "del": "del"
      },
      Heritage: {
        "id": "id",
        "Название": "name",
        "Код": "code",
        "Адрес": "address",
        "Датировка": "date",
        "red": "red",
        "del": "del"
      },
      Culture: {
        "id": "id",
        "Название": "name",
        "red": "red",
        "del": "del"
      },
      Epoch: {
        "id": "id",
        "Название": "name",
        "red": "red",
        "del": "del"
      },
      City: {
        "id": "id",
        "Название": "name",
        "red": "red",
        "del": "del"
      },
      Organization: {
        "id": "id",
        "Название": "name",
        "red": "red",
        "del": "del"
      },
      Report: {
        "id": "id",
        "Название": "name",
        "Автор": "author",
        "Год": "year",
        "Исследование": "res",
        "red": "red",
        "del": "del"
      },
      Publication: {
        "id": "id",
        "Название": "name",
        "Автор": "author",
        "Год": "year",
        "red": "red",
        "del": "del"
      }
    }

    $("#show-button").on("click", function() {
      let entity = $("#entity-selector").val();
      let name = $("#entity-name-input").val();
      let query;

      const tr = App.locale.translate;
      const ctl = App.locale.getLang() === "en" ? App.locale.cyrToLatin : src => src;

      let data = {};
      let tmp = [];
      let model = App.models.fn;

      let render = function() {
        _.each(tmp[0], function(collection, name) {
          _.each(collection, function(obj, t) {
            if (name == "know") {
              data[entity][t][name] = _.pluck(obj, "monument_name").join(", ");
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
              html += `<td><a href="#${ entity.toLowerCase() }/show/${row.id}">${ tr("admin.edit") }</a></td>`
            } else if (val == "del") {
              html += `<td><a class="entity-delete" data-entity="${entity}" data-id="${row.id}">${ tr("admin.delete") }</a></td>`
            } else {
              row[val] = row[val] || "";
              const line = typeof row[val] === "string" ? ctl(row[val]) : row[val];
              html += `<td>${ line }</td>`;
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

      query = queries[entity].main;
      query = query.replace(/FILTER/g, name);

      $.when(model.sendQuery(query)).then(function(response) {
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