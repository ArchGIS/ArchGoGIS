'use strict';


App.controllers.research = new (Backbone.View.extend({
  'new_by_report': function() {
    App.page.render('research/new_by_report', {
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

  "new_by_pub": function() {
    App.page.render('research/new_by_pub', {
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
      },
    });
  }, 

  'show': function() {
    App.url.setMapping(['id']);
    var resId = App.url.get("id");
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        monuments: JSON.stringify({
          "research:Research": {"id": resId},
          "knowledges:Knowledge": {"id": "*"},
          "monuments:Monument": {"id": "*", "select": "*"},
          "research__has__knowledges": {},
          "knowledges__belongsto__monuments": {},
        }),

        artifacts: JSON.stringify({
          "research:Research": {"id": resId},
          "interpretations:Interpretation": {"id": "*", "select": "*"},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "artiSpatref:SpatialReference": {"id": "*", "select": "*"},
          "artiSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "artifacts__has__artiSpatref": {},
          "artiSpatref__has__artiSpatrefT": {},
          "artifacts__has__interpretations": {},
          "research__has__interpretations": {},
        }),

        knowledges: JSON.stringify({
          "research:Research": {"id": resId},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monuments:Monument": {"id": "*"},
          "research__has__knowledges": {},
          "knowledges__belongsto__monuments": {},
        })
      },

      single: {
        research: JSON.stringify({
          "research:Research": {"id": resId, "select": "*"},
        }),
        author: JSON.stringify({
          "research:Research": {"id": resId},
          "author:Author": {"id": "*", "select": "*"},
          "research__hasauthor__author": {},
        }),
        coauthors: JSON.stringify({
          "research:Research": {"id": resId},
          "coauthors:Author": {"id": "*", "select": "*"},
          "research__hascoauthor__coauthors": {},
        }),
        resType: JSON.stringify({
          "research:Research": {"id": resId},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "research__has__resType": {},
        }),
        report: JSON.stringify({
          "research:Research": {"id": resId},
          "author:Author": {"id": "*"},
          "reports:Report": {"id": "*", "select": "*"},
          "reports__hasauthor__author": {},
          "research__has__reports": {}
        })
      },

      monuments: {
        epochs: JSON.stringify({
          "monuments:Monument": {"id": "NEED"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "monuments__has__epoch": {},
        }),
        monTypes: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "monument__has__monType": {},
        }),
        excavations: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "r:Research": {"id": resId},
          "excavations:Excavation": {"id": "*", "select": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavations__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
          "m__has__excavations": {},
          "r__has__excavations": {}
        }),
        heritages: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "heritage:Heritage": {"id": "*", "select": "*"},
          "herSpatref:SpatialReference": {"id": "*", "select": "*"},
          "herSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "heritage__has__monument": {},
          "heritage__has__herSpatref": {},
          "herSpatref__has__herSpatrefT": {}
        }),
        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        })
      },

      knowledges: {
        cultures: JSON.stringify({
          "knowledges:Knowledge": {"id": "NEED"},
          "cultures:Culture": {"id": "*", "select": "*"},
          "knowledges__has__cultures": {},
        }),
        topos: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "topo:Image": {"id": "*", "select": "*"},
          "knowledge__hastopo__topo": {}
        }) 
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      tmplData.placemarks = [];

      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);
      let herPlacemarks = App.controllers.fn.getHerPlacemarks(tmplData);
      let excPlacemarks = App.controllers.fn.getExcPlacemarks(tmplData);
      let artPlacemarks = App.controllers.fn.getArtPlacemarks(tmplData);

      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, herPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, excPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, artPlacemarks);

      App.page.render('research/show', tmplData, tmplData.placemarks)
    };

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
