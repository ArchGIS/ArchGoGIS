'use strict';

App.controllers.artifact = new (Backbone.View.extend({
  'new_by_report': function() {
    App.page.render('artifact/new_by_report', {
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

  'new_by_pub': function() {
    App.page.render('artifact/new_by_pub', {
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
    var aid = App.url.get('id');
    var data = [];
    var tmplData = {};
    var model = App.models.fn;

    var queries = {
      complex: {
        monuments: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monuments:Monument": {"id": "*", "select": "*"},
          "knowledges__found__artifact": {},
          "knowledges__belongsto__monuments": {},
        }),
        interpretations: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "interpretations:Interpretation": {"id": "*", "select": "*"},
          "artifact__has__interpretations": {},
        }),
      },

      single: {
        artifact: JSON.stringify({
          "artifact:Artifact": {"id": aid, "select": "*"}
        }),
        artiSpatref: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "artiSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "artifact__has__artiSpatref": {},
          "artiSpatref__has__artiSpatrefT": {},
        }),
        category: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "categories:ArtifactCategory": {"id": "*", "select": "*"},
          "artifact__has__categories": {},
        }),
        photosa: JSON.stringify({
          "a:Artifact": {"id": aid},
          "photosa:Image": {"id": "*", "select": "*"},
          "a__has__photosa": {},
        }),
        excavations: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "excavation:Excavation": {"id": "*", "select": "*"},
          "excavation__has__artifact": {},
        }),
        excSpatref: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "excavation:Excavation": {"id": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavation__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
          "excavation__has__artifact": {},
        }),
        materials: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "materials:ArtifactMaterial": {"id": "*", "select": "*"},
          "artifact__has__materials": {},
        }),
        collections: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "intervals:StorageInterval": {"id": "*", "select": "*"},
          "colls:Collection": {"id": "*", "select": "*"},
          "artifact__has__intervals": {},
          "colls__has__intervals": {},
        })
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

      interpretations: {
        photos: JSON.stringify({
          "inter:Interpretation": {"id": "NEED"},
          "photos:Image": {"id": "*", "select": "*"},
          "inter__has__photos": {},
        }),
        culture: JSON.stringify({
          "inter:Interpretation": {"id": "NEED"},
          "culture:Culture": {"id": "*", "select": "*"},
          "inter__has__culture": {},
        }),
        dateScale: JSON.stringify({
          "inter:Interpretation": {"id": "NEED"},
          "dateScale:DateScale": {"id": "*", "select": "*"},
          "inter__has__dateScale": {},
        }),
        researches: JSON.stringify({
          "inter:Interpretation": {"id": "NEED"},
          "research:Research": {"id": "*", "select": "*"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "research__has__inter": {},
          "research__has__resType": {},
          "research__hasauthor__author": {},
        }),
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
      let artPlacemarks = App.controllers.fn.getArtPlacemarks(tmplData, true);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, excPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, artPlacemarks);

      App.page.render("artifact/show", tmplData, tmplData.placemarks);
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

  'start': function() {
    console.log('artifact controller is launched');
  }
}));
