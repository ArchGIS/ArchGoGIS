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
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monuments:Monument": {"id": "*", "select": "*"},
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
        }),
        usedArtifacts: JSON.stringify({
          "research:Research": {"id": resId},
          "usedArtifacts:Artifact": {"id": "*", "select": "*"},
          "research__used__usedArtifacts": {}
        })
      },

      monument: {
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
          "exc:Excavation": {"id": "*", "select": "*"},
          "m__has__exc": {},
          "r__has__exc": {}
        }),
        heritages: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "heritage:Heritage": {"id": "*", "select": "*"},
          "heritage__has__monument": {}
        }),
        spatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "spatref:SpatialReference": {"id": "*", "select": "*"},
          "spatrefType:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__spatref": {},
          "spatref__has__spatrefType": {}
        })
      },

      knowledge: {
        cultures: JSON.stringify({
          "knowledges:Knowledge": {"id": "NEED"},
          "cultures:Culture": {"id": "*", "select": "*"},
          "knowledges__has__cultures": {},
        }),
        artifacts: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "knowledge__found__artifacts": {}
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
      _.each(tmplData.knowledges, function(k, kid) {
        const type = tmplData.monTypes[kid][0].id;
        const epoch = tmplData.epochs[kid][0].id;

        tmplData.placemarks.push({
          type: 'monument',
          id: tmplData.monuments[kid].id,
          coords: [k.x, k.y],
          pref: {
            hintContent: k.monument_name
          },
          opts: {
            preset: `monType${type}_${epoch}`
          }
        })
      })

      _.each(tmplData.spatref, function(coordlist, i) {
        let dataRet = {
          date: 0, 
          type: 6, 
          x: "нет данных", 
          y: "нет данных",
        };

        _.each(coordlist.spatref, function(coord, t) {
          if ((coordlist.spatrefType[t].id < dataRet.type) || ((coordlist.spatrefType[t].id == dataRet.type) && (coord.date > dataRet.date))) {
            dataRet.x = coord.x;
            dataRet.y = coord.y;
            dataRet.date = coord.date;
          }
        })

        if (dataRet.date > 0) {
          let type = tmplData.monTypes[i][0].id || 10;
          let epoch = tmplData.epochs[i][0].id || 1;
          tmplData.placemarks.push({
            type: 'monument',
            id: tmplData.monuments[i].id,
            coords: [dataRet.x, dataRet.y],
            pref: {
              hintContent: tmplData.knowledges[i].monument_name
            },
            opts: {
              preset: `monType${type}_${epoch}`
            }
          })
        }
      })

      let resYear = (tmplData.research.year) ? ` (${tmplData.research.year})` : "";
      _.each(tmplData.excavations, function(resExc, resId) {
        _.each(resExc, function(exc, excId) {
          var type = (exc.area <= 20) ? 1 : 2;
          tmplData.placemarks.push({
            type: 'excavation',
            id: exc.id,
            coords: [exc.x, exc.y],
            pref: {
              hintContent: exc.name + resYear,
            },
            opts: {
              preset: `excType${type}`
            }
          })
        })
      })

      _.each(tmplData.artifacts, function(artif, artifId) {
        _.each(artif, function(art, artId) {
          tmplData.placemarks.push({
            type: 'artifact',
            id: art.id,
            coords: [art.x, art.y],
            pref: {
              hintContent: art.name,
            },
            opts: {
              preset: `artifact`
            }
          })
        })
      })

      _.each(tmplData.heritages, function(herit, heritId) {
        _.each(herit, function(her, hId) {
          tmplData.placemarks.push({
            type: 'heritage',
            id: her.id,
            coords: [her.x, her.y],
            pref: {
              hintContent: her.name,
            },
            opts: {
              preset: `heritage`
            }
          })
        })
      })

      App.page.render('research/show', tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.monuments)).then(function(response) {
      _.extend(tmplData, response);

      var monumentIds = _.map(tmplData.monuments, function(mon) {return mon.id.toString()});
      var knowledgeIds = _.map(tmplData.knowledges, function(know) {return know.id.toString()});

      data.push(model.getData(queries.monument, callRender, true, monumentIds));
      data.push(model.getData(queries.knowledge, callRender, true, knowledgeIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  }
}));
