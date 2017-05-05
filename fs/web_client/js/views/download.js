'use strict';

App.views.download = new (Backbone.View.extend({
  'index': function() {
    const t = App.locale.translate;
    const prefix = App.locale.getLang() === 'ru' ? '' : `${App.locale.getLang()}_`;

    let queries = {

      Monument: {
        main: JSON.stringify({
          "Monument:Monument": {"id": "*", "select": "*"},
          "know:Knowledge": {"id": "*", "filter": "monument_name=FILTER=text"},
          "know__belongsto__Monument": {},
          "sp:SpatialReference": {"id": "*", "filter": "x=BOT=more;x=TOP=less;y=LEFT=more;y=RIGHT=less"},
          "spt:SpatialReferenceType": {"id": "*"},
          "Monument__has__sp": {},
          "sp__has__spt": {},
        }),

        needCulture: JSON.stringify({
          "Monument:Monument": {"id": "*", "select": "*"},
          "know:Knowledge": {"id": "*", "filter": "monument_name=FILTER=text"},
          "cul:Culture": {"id": "?", "filter": "name=CFIL=text"},
          "know__belongsto__Monument": {},
          "know__has__cul": {},
          "sp:SpatialReference": {"id": "*", "filter": "x=BOT=more;x=TOP=less;y=LEFT=more;y=RIGHT=less"},
          "spt:SpatialReferenceType": {"id": "*"},
          "Monument__has__sp": {},
          "sp__has__spt": {},
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


      Radiocarbon: {
        main: JSON.stringify({
          "Radiocarbon:Radiocarbon": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        needCulture: JSON.stringify({
          "Radiocarbon:Radiocarbon": {"id": "*", "select": "*", "filter": "name=FILTER=text"},
        }),

        additional: {
          know: JSON.stringify({
            "r:Radiocarbon": {"id": "NEED"},
            "res:Research": {"id": "*"},
            "know:Knowledge": {"id": "*", "select": "*"},
            "res__know": {},
            "r__know": {},
          }),
          cult: JSON.stringify({
            "r:Radiocarbon": {"id": "NEED"},
            "res:Research": {"id": "*"},
            "know:Knowledge": {"id": "*"},
            "cult:Culture": {"id": "*", "select": "*"},
            "res__know": {},
            "r__know": {},
            "know__cult": {},
          }),
          material: JSON.stringify({
            "r:Radiocarbon": {"id": "NEED"},
            "material:CarbonMaterial": {"id": "*"},
            "r__material": {},
          }),
          spatref: JSON.stringify({
            "h:Radiocarbon": {"id": "NEED"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "h__has__sp": {},
            "sp__has__spt": {},
          }),
          spatref1: JSON.stringify({
            "carbon:Radiocarbon": {"id": "NEED"},
            "exc:Excavation": {"id": "*"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "exc__has__carbon": {},
            "exc__has__sp": {},
            "sp__has__spt": {}
          }),
          spatref2: JSON.stringify({
            "carbon:Radiocarbon": {"id": "NEED"},
            "know:Knowledge": {"id": "*"},
            "mon:Monument": {"id": "*"},
            "sp:SpatialReference": {"id": "*", "select": "*"},
            "spt:SpatialReferenceType": {"id": "*", "select": "*"},
            "know__has__carbon": {},
            "know__belongsto__mon": {},
            "mon__has__sp": {},
            "sp__has__spt": {}
          }),
        }
      },
    }

    const name       = t('common.name'),
          mType      = t('monument.prop.type'),
          mEpoch     = t('monument.prop.epoch'),
          mCulture   = t('admin.culture'),
          coords     = t('coord.plural'),
          aCategory  = t('artifact.category'),
          aYearFound = t('artifact.yearFound'),
          aMon       = t('monument.singular'),
          aExc       = t('excavation.second'),
          hAddress   = t('common.address'),
          hDate      = t('date.singular'),
          cIndex     = t('radiocarbon.index'),
          cMonName   = t('monument.name'),
          cMonCult   = t('monument.culture'),
          cDate      = t('radiocarbon.date'),
          cMaterial  = t('radiocarbon.material');

    let fields = {

      Monument: {
        "id": "id",
        [name]: "know",
        [mType]: "type",
        [mEpoch]: "epoch",
        [mCulture]: "cul",
        [coords]: "coords",
      },
      Artifact: {
        "id": "id",
        [name]: "name",
        [aCategory]: "categ",
        [aYearFound]: "year",
        [aMon]: "know",
        [aExc]: "exc",
        [coords]: "coords",
      },

      Heritage: {
        "id": "id",
        [name]: "name",
        [hAddress]: "address",
        [hDate]: "date",
        [coords]: "coords",
      },

      Radiocarbon: {
        "id": "id",
        [cIndex]: "name",
        [cDate]: "date",
        "1s": "s",
        [cMonName]: "know",
        [cMonCult]: "cult",
        [coords]: "spatref",
        [cMaterial]: "material",
      },
    }

    $("#show-button").on("click", function() {
      let entity = $("#entity-selector").val();
      let name = $("#entity-name-input").val();
      let cfil = $("#entity-culture-input").val();
      let query;

      const ctl = App.locale.getLang() === "en" ? App.locale.cyrToLatin : src => src;

      let data = {};
      let tmp = [];
      let model = App.models.fn;

      let left = $("#coords-left").val() || "";
      let top = $("#coords-top").val() || "";
      let right = $("#coords-right").val() || "";
      let bot = $("#coords-bottom").val() || "";
      let coordsCrit = false;

      if (left && top && right && bot) {
        coordsCrit = true;
      } else {
        left = 1;
        right = 1000;
        top = 1000;
        bot = -1000;        
      }

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
            } else if (name == "spatref") {
              // let coords = App.fn.findActualSpatref(obj.sp, obj.spt);
              let coords = [];
              let counter = 1;
              // console.log(tmp[0])

              while ((_.isUndefined(coords.x) || _.isUndefined(coords.x)) && tmp[0]["spatref"+counter]) {
                let spatrefs = tmp[0]["spatref"+counter++][t];
                coords = App.fn.findActualSpatref(spatrefs.sp, spatrefs.spt);
                console.log(spatrefs)
              }

              if (!_.isUndefined(coords.x) && !_.isUndefined(coords.x)) {
                data[entity][t][name] = `N: ${coords.x}, E: ${coords.y}`;
              }
            } else {
              data[entity][t][name] = _.pluck(obj, `${prefix}name`).join(", ");
            }
          })
        })
        console.log(tmp)
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
              const line = typeof row[val] === "string" ? ctl(row[val]) : row[val];
              html += `<td>${ line }</td>`
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
      query = query.replace(/BOT/g, bot);
      query = query.replace(/TOP/g, top);
      query = query.replace(/LEFT/g, left);
      query = query.replace(/RIGHT/g, right);
      console.log(query, bot, top)
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