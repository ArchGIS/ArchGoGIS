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
        usedIn: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "researches:Research": {"id": "*", "select": "*"},
          "authors:Author": {"id": "*", "select": "*"},
          "researches__used__artifact": {},
          "researches__hasauthor__authors": {}
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
        photos: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "photos:Image": {"id": "*", "select": "*"},
          "artifact__has__photos": {},
        }),
        excavation: JSON.stringify({
          "artifact:Artifact": {"id": aid},
          "exc:excavation": {"id": "*", "select": "*"},
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
          "intervals__belongsto__colls": {},
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

      researchUsed: {
        resUsedType: JSON.stringify({
          "r:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "r__has__resType": {},
        }),
      },

      researchFound: {
        resFoundType: JSON.stringify({
          "r:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "r__has__resType": {},
        }),
      }
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
      var researchId = [tmplData.resFound[0].id]

      data.push(model.getData(queries.monument, callRender, true, monumentId));
      data.push(model.getData(queries.researchFound, callRender, true, researchId));
      callRender();
    })

    $.when(model.sendQuery(queries.complex.usedIn)).then(function(response) {
      _.extend(tmplData, response);

      var researchIds = _.map(tmplData.researches, function(res) {return res.id.toString()});

      data.push(model.getData(queries.researchUsed, callRender, true, researchIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  },

  'start': function() {
    console.log('artifact controller is launched');
  }
}));
