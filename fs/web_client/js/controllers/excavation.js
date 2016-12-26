'use strict';

App.controllers.excavation = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var excId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
    	complex: {
        mons: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "mons:Monument": {"id": "*", "select": "*"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "mons__has__exc": {},
          "mons__has__epoch": {},
          "mons__has__monType": {},
        }),
        artifacts: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "arti:Artifact": {"id": "*", "select": "*"},
          "exc__has__arti": {}
        }),
      },

      single: {
        excavation: JSON.stringify({
          "exc:Excavation": {"id": excId, "select": "*"}
        }),
        research: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "res:Research": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "res__has__exc": {},
          "res__hasauthor__author": {}
        }),
      },

      artifacts: {
        photo: JSON.stringify({
          "arti:Artifact": {"id": "NEED"},
          "inter:Interpretation": {"id": "*"},
          "photo:Image": {"id": "*", "select": "*"},
          "arti__has__inter": {},
          "inter__has__photo": {},
        }),
      },

      monuments: {
        knowledge: JSON.stringify({
          "mon:Monument": {"id": "NEED"},
          "know:Knowledge": {"id": "*", "select": "*"},
          "know__belongsto__mon": {},
        }),
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      console.log(tmplData)
    	App.page.render("excavation/show", tmplData)
  	}

  	var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.mons)).then(function(response) {
      _.extend(tmplData, response);

      var monIds = _.map(tmplData.mons, function(res) {return res.id.toString()});

      data.push(model.getData(queries.monuments, callRender, true, monIds));
      callRender();
    })

    $.when(model.sendQuery(queries.complex.artifacts)).then(function(response) {
      _.extend(tmplData, response);

      var artiIds = _.map(tmplData.arti, function(res) {return res.id.toString()});

      data.push(model.getData(queries.artifacts, callRender, true, artiIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  }
}))