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
        monuments: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "monuments:Monument": {"id": "*", "select": "*"},
          "monuments__has__exc": {},
        }),
        artifacts: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "exc__has__artifacts": {}
        }),
      },

      single: {
        excavation: JSON.stringify({
          "excavation:Excavation": {"id": excId, "select": "*"}
        }),
        excSpatref: JSON.stringify({
          "excavation:Excavation": {"id": excId},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavation__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
        }),
        researches: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "researches:Research": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "researches__has__exc": {},
          "researches__hasauthor__author": {}
        }),
        radiocarbon: JSON.stringify({
          "exc:Excavation": {"id": excId},
          "carbon:Radiocarbon": {"id": "*", "select": "*"},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "exc__has__carbon": {},
          "carbon__has__carSpatref": {},
          "carSpatref__has__carSpatrefT": {}
        })
      },

      artifacts: {
        artiSpatref: JSON.stringify({
          "artifacts:Artifact": {"id": "NEED"},
          "artiSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "artifacts__has__artiSpatref": {},
          "artiSpatref__has__artiSpatrefT": {},
        }),
        photo: JSON.stringify({
          "arti:Artifact": {"id": "NEED"},
          "inter:Interpretation": {"id": "*"},
          "photo:Image": {"id": "*", "select": "*"},
          "arti__has__inter": {},
          "inter__has__photo": {},
        }),
      },

      monuments: {
        knowledges: JSON.stringify({
          "mon:Monument": {"id": "NEED"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "knowledges__belongsto__mon": {},
        }),
        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        }),
        epochs: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "epochs:Epoch": {"id": "*", "select": "*"},
          "monument__has__epochs": {},
        }),
        monTypes: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "monument__has__monTypes": {},
        }),
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })

      tmplData.placemarks = [];

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);
      let excPlacemarks = App.controllers.fn.getExcPlacemarks(tmplData, true);
      let artPlacemarks = App.controllers.fn.getArtPlacemarks(tmplData);
      let carPlacemarks = App.controllers.fn.getCarPlacemarks(tmplData);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, excPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, artPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, carPlacemarks);

      console.log(tmplData)
    	App.page.render("excavation/show", tmplData, tmplData.placemarks)
  	}

  	var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

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
}))