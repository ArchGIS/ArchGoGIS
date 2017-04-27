'use strict';

App.controllers.radiocarbon = new (Backbone.View.extend({
  'new_by_pub': function() {
    App.page.render('radiocarbon/new_by_pub', {
      'param': 'test data',
      'authorsInputOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      },
      'coauthorsInputOptions': {
        'source': App.models.Author.findByLastNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        },
        'multipleInput': true
      },
      'citiesInputOptions': {
        'source': App.models.City.findByNamePrefix,
        'etl': function(cities) {
          return _.map(cities, city => ({'id': city.id, 'label': city.name}));
        }
      }
    })
  },

  'show': function() {
    App.url.setMapping(['id']);
    var rid = App.url.get('id');
    var data = [];
    var tmplData = {};
    var model = App.models.fn;

    var queries = {
      complex: {
        monuments: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monuments:Monument": {"id": "*", "select": "*"},
          "knowledges__r": {},
          "knowledges__belongsto__monuments": {},
        }),
      },

      single: {
        radiocarbon: JSON.stringify({
          "carbon:Radiocarbon": {"id": rid, "select": "*"}
        }),
        dateType: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "dateType:RadiocarbonDateType": {"id": "*", "select": "*"},
          "r__dateType": {},
        }),
        complex: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "complex:Complex": {"id": "*", "select": "*"},
          "r__complex": {},
        }),
        genesis: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "genesis:SludgeGenesis": {"id": "*", "select": "*"},
          "r__genesis": {},
        }),
        facies: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "genesis:SludgeGenesis": {"id": "*"},
          "facies:Facies": {"id": "*", "select": "*"},
          "genesis__facies": {},
          "r__genesis": {},
        }),
        material: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "material:CarbonMaterial": {"id": "*", "select": "*"},
          "r__material": {},
        }),
        carSpatref: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "r__has__carSpatref": {},
          "carSpatref__has__carSpatrefT": {},
        }),
        carbonExcSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": rid},
          "exc:Excavation": {"id": "*"},
          "carExcSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carExcSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "exc__has__carbon": {},
          "exc__has__carExcSpatref": {},
          "carExcSpatref__has__carExcSpatrefT": {}
        }),
        carbonMonSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": rid},
          "know:Knowledge": {"id": "*"},
          "mon:Monument": {"id": "*"},
          "carMonSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carMonSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "know__has__carbon": {},
          "know__belongsto__mon": {},
          "mon__has__carMonSpatref": {},
          "carMonSpatref__has__carMonSpatrefT": {}
        }),
        photosa: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "photosr:Image": {"id": "*", "select": "*"},
          "r__has__photosr": {},
        }),
        excavations: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "excavation:Excavation": {"id": "*", "select": "*"},
          "excavation__has__r": {},
        }),
        excSpatref: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "excavation:Excavation": {"id": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavation__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
          "excavation__has__r": {},
        }),
        researches: JSON.stringify({
          "r:Radiocarbon": {"id": rid},
          "researches:Research": {"id": "*", "select": "*"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "researches__has__resType": {},
          "researches__hasauthor__author": {},
          "researches__has__r": {},
        }),
      },

      monuments: {
        monTypes: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "m__has__monType": {},
        }),
        epochs: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "e:Epoch": {"id": "*", "select": "*"},
          "m__has__e": {},
        }),
        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        })
      },
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      tmplData.placemarks = [];

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);
      let excPlacemarks = App.controllers.fn.getExcPlacemarks(tmplData, true);
      let carPlacemarks = App.controllers.fn.getCarPlacemarks(tmplData, true);


      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, excPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, carPlacemarks);

      App.page.render("radiocarbon/show", tmplData, tmplData.placemarks);
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
  },
}));