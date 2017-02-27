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
          "rep:Report": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "res__has__exc": {},
          "res__has__rep": {},
          "rep__hasauthor__author": {},
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

      tmplData.placemarks = [];

      let resYear = (tmplData.res.year) ? ` (${tmplData.res.year})` : "";
      let type = (tmplData.exc.area <= 20) ? 1 : 2;
      tmplData.placemarks.push({
        type: 'excavation',
        id: tmplData.exc.id,
        coords: [tmplData.exc.x, tmplData.exc.y],
        pref: {
          hintContent: tmplData.exc.name + resYear,
        },
        opts: {
          preset: `excType${type}`
        }
      })

      _.each(tmplData.knowledge, function(knowl, knowId) {
        _.each(knowl, (k, kid) => {
          const type = tmplData.monType[0].id;
          const epoch = tmplData.epoch[0].id;

          tmplData.placemarks.push({
            type: 'monument',
            id: k.id,
            coords: [k.x, k.y],
            pref: {
              hintContent: k.monument_name
            },
            opts: {
              preset: `monType${type}_${epoch}`
            }
          })
        })
      })

      _.each(tmplData.arti, function(arti, artiId) {
        tmplData.placemarks.push({
          type: 'artifact',
          id: arti.id,
          coords: [arti.x, arti.y],
          pref: {
            hintContent: arti.name,
          },
          opts: {
            preset: `artifact1`
          }
        })
      })

      console.log(tmplData)
    	App.page.render("excavation/show", tmplData, tmplData.placemarks)
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