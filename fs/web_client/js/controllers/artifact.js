'use strict';

App.controllers.artifact = new (Backbone.View.extend({
  'new_by_research': function() {
    App.page.render('artifact/new_by_research', {
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
        }
      },
      'citiesInputOptions': {
        'source': App.models.City.findByNamePrefix,
        'etl': function(cities) {
          return _.map(cities, city => ({'id': city.id, 'label': city.name}));
        }
      }
    });
  },

  'new_by_report': function() {
    App.page.render('artifact/new_by_report', {
      'param': 'test data',
      'authorsInputOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
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
        foundIn: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "knowFound:Knowledge": {"id": "*", "select": "*"},
          "monFound:Monument": {"id": "*", "select": "*"},
          "resFound:Research": {"id": "*", "select": "*"},
          "authorFound:Author": {"id": "*", "select": "*"},
          "knowFound__found__artifact": {},
          "knowFound__belongsto__monFound": {},
          "resFound__has__knowFound": {},
          "resFound__hasauthor__authorFound": {},
        }),
        interpretations: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "inters:Interpretation": {"id": "*", "select": "*"},
          "dateScale:DateScale": {"id": "*", "select": "*"},
          "artifact__has__inters": {},
          "inters__has__dateScale": {},
        }),
      },

      single: {
        artifact: JSON.stringify({
          "artifact:Artifact": {"id": aid, "select": "*"}
        }),
        category: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "categories:ArtifactCategory": {"id": "*", "select": "*"},
          "artifact__has__categories": {},
        }),
        excavation: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "exc:Excavation": {"id": "*", "select": "*"},
          "exc__has__artifact": {},
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

      monument: {
        monType: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "m__has__monType": {},
        }),
        epoch: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "e:Epoch": {"id": "*", "select": "*"},
          "m__has__e": {},
        })
      },

      interpretation: {
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
      var type = (tmplData.monType[0][0]) ? tmplData.monType[0][0].id : 10;
      var epoch = (tmplData.epoch[0][0]) ? tmplData.epoch[0][0].id : 10;
      tmplData.placemarks.push({
        type: 'monument',
        id: tmplData.knowFound[0].id,
        coords: [tmplData.knowFound[0].x, tmplData.knowFound[0].y],
        pref: {
          hintContent: tmplData.knowFound[0].monument_name
        },
        opts: {
          preset: `monType${type}_${epoch}`
        }
      })

      App.page.render("artifact/show", tmplData);
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.foundIn)).then(function(response) {
      _.extend(tmplData, response);

      var monumentId = [tmplData.monFound[0].id];

      data.push(model.getData(queries.monument, callRender, true, monumentId));
      callRender();
    })

    $.when(model.sendQuery(queries.complex.interpretations)).then(function(response) {
      _.extend(tmplData, response);

      var interIds = _.map(tmplData.inters, function(res) {return res.id.toString()});

      data.push(model.getData(queries.interpretation, callRender, true, interIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  },

  'start': function() {
    console.log('artifact controller is launched');
  }
}));
