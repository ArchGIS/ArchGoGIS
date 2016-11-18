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

        secType: JSON.stringify({
          "secType:SecurityType": {"id": "*", "select": "*"},
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
      }
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

    data.push(model.getData(queries.single, callRender));
  }
}));