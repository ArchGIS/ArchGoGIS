'use strict';

App.controllers.heritage = new (Backbone.View.extend({
  'new': function() {
    App.page.render('heritage/new', {})
  },

  'show': function() {
    App.url.setMapping(['id']);
    var hId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
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

        secType: JSON.stringify({
          "h:Heritage": {"id": hId},
          "secType:SecurityType": {"id": "*", "select": "*"},
          "h__has__secType": {},
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
        })
      },

      surveyMap: {
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

      monument: {
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
      },

      // research: {
      //   researches: JSON.stringify({
      //     "k:Knowledge": {"id": "NEED"},
      //     "research:Research": {"id": "*", "select": "*"},
      //     "resType:ResearchType": {"id": "*", "select": "*"},
      //     "report:Report": {"id": "*", "select": "*"},
      //     "author:Author": {"id": "*", "select": "*"},
      //     "research__has__k": {},
      //     "research__has__resType": {},
      //     "research__has__report": {},
      //     "research__hasauhthor__author": {},
      //     "report__hasauhthor__author": {},
      //   })
      // }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      let stateTables = [];

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
      console.log(tmplData);
      App.page.render("heritage/show", tmplData, {"stateTables": stateTables})
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.surveyMaps)).then(function(response) {
      _.extend(tmplData, response);

      var mapIds = _.map(tmplData.surveyMaps, function(map) {return map.id.toString()});
      data.push(model.getData(queries.surveyMap, callRender, true, mapIds));
     
      callRender();
    })

    $.when(model.sendQuery(queries.complex.monuments)).then(function(response) {
      _.extend(tmplData, response);

      var monIds = _.map(tmplData.monuments, function(mon) {return mon.id.toString()});
      var mons = model.getData(queries.monument, callRender, true, monIds);
      data.push(mons);
      // var knowIds = _.map(mons.surveyMaps, function(know) {return know.id.toString()});
      // console.log(mons)
      // data.push(model.getData(queries.surveyMap, callRender, true, mapIds));

      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  }
}));