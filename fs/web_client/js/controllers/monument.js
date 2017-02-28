'use strict';

App.controllers.monument = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var monId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        mainInfo: JSON.stringify({
          "monument:Monument": {"id": monId, "select": "*"},
          "researches:Research": {"id": "*", "select": "*"},
          "authors:Author": {"id": "*", "select": "*"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "researches__hasauthor__authors": {},
          "researches__has__knowledges": {},
          "knowledges__belongsto__monument": {},
        })
      },

      single: {
        cultures: JSON.stringify({
          "monument:Monument": {"id": monId},
          "knowledges:Knowledge": {"id": "*"},
          "cultures:Culture": {"id": "*", "select": "*"},
          "knowledges__belongsto__monument": {},
          "knowledges__has__cultures": {},
        }),
        epoch: JSON.stringify({
          "monument:Monument": {"id": monId},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "monument__has__epoch": {},
        }),
        monType: JSON.stringify({
          "monument:Monument": {"id": monId},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "monument__has__monType": {},
        }),
        heritage: JSON.stringify({
          "monument:Monument": {"id": monId},
          "heritage:Heritage": {"id": "*", "select": "*"},
          "heritage__has__monument": {}
        }),
        spatref: JSON.stringify({
          "monument:Monument": {"id": monId},
          "spatref:SpatialReference": {"id": "*", "select": "*"},
          "spatrefType:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__spatref": {},
          "spatref__has__spatrefType": {}
        })
      },

      research: {
        resTypes: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches__has__resType": {},
        }),
        reports: JSON.stringify({
          "research:Research": {"id": "NEED"},
          "report:Report": {"id": "*", "select": "*"},
          "author:Author": {"id": "*"},
          "research__has__report": {},
          "research__hasauthor__author": {},
          "report__hasauthor__author": {}
        }),
        excavations: JSON.stringify({
          "monument:Monument": {"id": monId},
          "r:Research": {"id": "NEED"},
          "exc:Excavation": {"id": "*", "select": "*"},
          "monument__has__exc": {},
          "r__has__exc": {},
        })
      },

      knowledge: {
        artifacts: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "knowledge__found__artifacts": {}
        }),
        photos: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "photo:Image": {"id": "*", "select": "*"},
          "cd:CardinalDirection": {"id": "*", "select": "*"},
          "knowledge__has__photo": {},
          "photo__has__cd": {}
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

      var names = {};
      _.each(tmplData.knowledges, function(k, id) {
        (names[k.monument_name]) ? names[k.monument_name]++ : names[k.monument_name] = 1;
      })
      tmplData.mainName = _(names).invert()[_(names).max()];
      tmplData.allNames = _.keys(names).join(', ');

      tmplData.placemarks = [];
      _.each(tmplData.excavations, function(resExc, resId) {
        let resYear = (tmplData.researches[resId].year) ? ` (${tmplData.researches[resId].year})` : "";
        _.each(resExc, function(exc, excId) {
          let type = (exc.area <= 20) ? 1 : 2;
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

      _.each(tmplData.knowledges, function(know, kid) {
        let type = tmplData.monType[0].id || 10;
        let epoch = tmplData.epoch[0].id || 1;
        tmplData.placemarks.push({
          type: 'monument',
          id: tmplData.monument.id,
          coords: [know.x, know.y],
          pref: {
            hintContent: know.monument_name
          },
          opts: {
            preset: `monType${type}_${epoch}`
          }
        })
      })

      _.each(tmplData.researches, function(res, rid) {
        let type = tmplData.resTypes[rid][0].id || 1;
        let resHeader = `${tmplData.authors[rid].name}, ${tmplData.resTypes[rid][0].name} (${tmplData.researches[rid].year})`
        tmplData.placemarks.push({
          type: 'research',
          id: res.id,
          coords: [tmplData.knowledges[rid].x, tmplData.knowledges[rid].y],
          pref: {
            hintContent: resHeader
          },
          opts: {
            preset: `resType${type}`
          }
        })
      })

      let dataRet = {
        date: 0, 
        type: 6, 
        x: "нет данных", 
        y: "нет данных",
      };

      _.each(tmplData.statref, function(coordlist, i) {
        _.each(coordlist, function(coord, t) {
          cosnole.log(coord)
          if ((tmplData.statrefType[i][t].id < dataRet.type) || ((tmplData.statrefType[i][t].id == dataRet.type) && (coord.date > dataRet.date))) {
            dataRet.x = coord.x;
            dataRet.y = coord.y;
            dataRet.date = coord.date;
          }
        })
      })

      if (dataRet.date > 0) {
        let type = tmplData.monType[0].id || 10;
        let epoch = tmplData.epoch[0].id || 1;
        tmplData.placemarks.push({
          type: 'monument',
          id: tmplData.monument.id,
          coords: [dataRet.x, dataRet.y],
          pref: {
            hintContent: know.monument_name
          },
          opts: {
            preset: `monType${type}_${epoch}`
          }
        })
      }
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
              preset: `artifact1`
            }
          })
        })
      })

      let spatref = _.groupBy(tmplData.spatref, function(obj, i) {
        return tmplData.spatrefType[i].id;
      })
      console.log(tmplData.spatrefType);
      tmplData.spatrefType = _.groupBy(tmplData.spatrefType, function(obj, i) {
        return obj.id;
      })
      _.each(spatref, function(list, i) {
        list = _.sortBy(list, function(obj, t) {
          obj.time;
        })
      })
      tmplData.spatref = spatref;

      console.log(spatref);
      console.log(tmplData);
      App.page.render("monument/show", tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.mainInfo)).then(function(response) {
      // response = _.sort(response)
      console.log(response)
      _.extend(tmplData, response);

      var researchIds = _.map(tmplData.researches, function(res) {return res.id.toString()});
      var knowledgeIds = _.map(tmplData.knowledges, function(know) {return know.id.toString()});

      data.push(model.getData(queries.research, callRender, true, researchIds));
      data.push(model.getData(queries.knowledge, callRender, true, knowledgeIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  },

  'new': function() {
    App.page.on("atClear", function() {
      console.log('monument controller is done (destructor)');
    });
    
    App.page.render('monument', {
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
      },
      'coauthorsInputOptions': {
        'source': App.models.Author.findByLastNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        },
        'multipleInput': true
      },
      'heritageInputOptions': {
        'source': App.models.Heritage.findByNamePrefix,
        'etl': function(herits) {
          return _.map(herits, h => ({'id': h.id, 'label': h.name}));
        }
      }
    });
  },

  "new_by_pub": function() {
    App.page.render('monument/new_by_pub', {
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

  "new_by_xlsx": function() {
    App.page.render("monument_from_xlsx");
  }, 

  "new_by_arch_map": function() {
    var m = App.models;
    var models = {
      "archMap": new m.ArchMap(),
      "knowledge": new m.Knowledge(),
      "monument": new m.Monument(),
      "researchRef": new m.ResearchRef(),
      "archMapRecord": new m.ArchMapRecord(),
      "literatureRef": new m.LiteratureRef()
      // "research": new App.models.Research(),
      // "collection": new App.models.Collection(),
      // "archMap": new App.models.ArchMap()
    };
    var form = new App.Form(models);
    window.form = form;
       
    App.page.render("monument/new_by_arch_map", {"form": form}, models);
  },

  'start': function() {
    console.log('monument controller is launched');
  }
}));
