'use strict';

App.controllers.heritage = new (Backbone.View.extend({
  'new': function() {
    App.page.render('heritage/new', {})
  },

  'show': function() {
    App.url.setMapping(['id', 'mod']);
    var hId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        researches: JSON.stringify({
          "heritage:Heritage": {"id": hId},
          "monument:Monument": {"id": "*"},
          "knowledges:Knowledge": {"id": "*"},
          "researches:Research": {"id": "*", "select": "*"},
          "authors:Author": {"id": "*", "select": "*"},
          "researches__hasauthor__authors": {},
          "researches__has__knowledges": {},
          "knowledges__belongsto__monument": {},
          "heritage__has__monument": {},
        }),

        surveyMaps: JSON.stringify({
          "h:Heritage": {"id": hId},
          "surveyMaps:SurveyMap": {"id": "*", "select": "*"},
          "h__has__surveyMaps": {}
        }),

        monuments: JSON.stringify({
          "h:Heritage": {"id": hId},
          "monuments:Monument": {"id": "*", "select": "*"},
          "h__has__monuments": {},
        }),
      },

      single: {
        heritage: JSON.stringify({
          "heritage:Heritage": {"id": hId, "select": "*"},
          "herStatus:HeritageStatus": {"id": "*", "select": "*"},
          "heritage__has__herStatus": {}
        }),

        herSpatref: JSON.stringify({
          "heritage:Heritage": {"id": hId},
          "herSpatref:SpatialReference": {"id": "*", "select": "*"},
          "herSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "heritage__has__herSpatref": {},
          "herSpatref__has__herSpatrefT": {}
        }),

        secType: JSON.stringify({
          "h:Heritage": {"id": hId},
          "secType:SecurityType": {"id": "*", "select": "*"},
          "h__has__secType": {},
        }),

        file: JSON.stringify({
          "h:Heritage": {"id": hId},
          "file:File": {"id": "*", "select": "*"},
          "h__has__file": {},
        }),

        monMaterial: JSON.stringify({
          "monMaterial:MonumentMaterial": {"id": "*", "select": "*"},
        }),

        monState: JSON.stringify({
          "monState:MonumentState": {"id": "*", "select": "*"},
        }),

        monDefect: JSON.stringify({
          "monDefect:MonumentDefect": {"id": "*", "select": "*"},
        }),

        photo: JSON.stringify({
          "h:Heritage": {"id": hId},
          "photo:Image": {"id": "*", "select": "*"},
          "cd:CardinalDirection": {"id": "*", "select": "*"},
          "h__has__photo": {},
          "photo__has__cd": {}
        }),

        topoplan: JSON.stringify({
          "h:Heritage": {"id": hId},
          "topo:Image": {"id": "*", "select": "*"},
          "h__hastopo__topo": {},
        })
      },

      surveyMaps: {
        lists: JSON.stringify({
          "map:SurveyMap": {"id": "NEED"},
          "ut:UsageType": {"id": "*", "select": "*"},
          "avail:Availability": {"id": "*", "select": "*"},
          "fp:FunctionalPurpose": {"id": "*", "select": "*"},
          "dt:DisposalType": {"id": "*", "select": "*"},
          "ot:OwnType": {"id": "*", "select": "*"},
          "map__has__ut": {},
          "map__has__avail": {},
          "map__has__fp": {},
          "map__has__dt": {},
          "map__has__ot": {}
        }),
      },

      monuments: {
        knowledges: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "knowledges__belongsto__m": {}
        }),

        epochs: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "epochs:Epoch": {"id": "*", "select": "*"},
          "m__has__epochs": {}
        }),

        monTypes: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "m__has__monTypes": {}
        }),

        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        }),
      },

      researches: {
        resTypes: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches__has__resType": {},
        }),
        excavations: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "excavations:Excavation": {"id": "*", "select": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "researches__has__excavations": {},
          "excavations__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
        }),
        resMonuments: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "knowledges:Knowledge": {"id": "*"},
          "resMonuments:Monument": {"id": "*", "select": "*"},
          "heritage:Heritage": {"id": "*"},
          "heritage__has__resMonuments": {},
          "knowledges__belongsto__resMonuments": {},
          "researches__has__knowledges": {},
        })
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      console.log(tmplData)

      let stateTables = [];
      tmplData.file = tmplData.file[0] || [];
      function getNames(obj) {
        let newObj = _.reduce(obj, function(memo, mem) {
          memo[mem.id] = mem.name;
          return memo;
        }, {})
        return newObj;
      }
      let monMat = getNames(tmplData.monMaterial);
      let monDef = getNames(tmplData.monDefect);
      let monState = getNames(tmplData.monState);

      _.each(tmplData.surveyMaps, function(map, id) {
        stateTables[id] = [];
        let table = JSON.parse(map.stateTable.replace(/\'/g, "\""))

        _.each(table, function(row, key) {
          stateTables[id][key] = [];
          stateTables[id][key][0] = (row[0] === "1") ? "Да" : "Нет";
          stateTables[id][key][1] = monMat[row[1]];
          stateTables[id][key][2] = monState[row[2]];
          stateTables[id][key][3] = monDef[row[3]];
          stateTables[id][key][4] = (row[4] === "1") ? "Да" : "Нет";
        })
      })

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);
      let resPlacemarks = App.controllers.fn.getResPlacemarks(tmplData);
      let herPlacemarks = App.controllers.fn.getHerPlacemarks(tmplData, true);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, resPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, herPlacemarks);

      App.page.render("heritage/show", tmplData, {
        "stateTables": stateTables,
        placemarks: tmplData.placemarks
      })
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    _.each(queries.complex, function(query, key) {
      $.when(model.sendQuery(query)).then(function(response) {
        _.extend(tmplData, response);

        var ids = _.map(tmplData[key], function(obj) {return obj.id.toString()});

        data.push(model.getData(queries[key], callRender, true, ids));
        callRender();
      })
    })

    data.push(model.getData(queries.single, callRender));
  }
}));