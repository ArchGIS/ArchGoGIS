'use strict';

App.controllers.monument = new (App.View.extend({
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
        _.each(resExc, function(exc, excId) {
          var type = (exc.area <= 20) ? 1 : 2;
          tmplData.placemarks.push({
            coords: [exc.x, exc.y],
            pref: {
              hintContent: exc.name
            },
            opts: {
              preset: `excType${type}`
            }
          })
        })
      })

      _.each(tmplData.knowledges, function(know, kid) {
        var type = (tmplData.resTypes[kid][0] && tmplData.resTypes[kid][0].id) ? tmplData.resTypes[kid][0].id : 1;
        tmplData.placemarks.push({
          coords: [know.x, know.y],
          pref: {
            hintContent: know.monument_name
          },
          opts: {
            preset: `resType${type}`
          }
        })
      })
      console.log(tmplData);
      App.page.render("monument/show", tmplData)
    }

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

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
      }
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
