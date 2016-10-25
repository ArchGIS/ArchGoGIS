'use strict';

App.controllers.monument = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var monId = App.url.get('id');
    var tmplData = {};

    var d1 = $.Deferred(),
        d2 = $.Deferred(),
        d3 = $.Deferred(),
        d4 = $.Deferred(),
        d5 = $.Deferred(),
        d6 = $.Deferred();

    var query_main_info = JSON.stringify({
      "monument:Monument": {"id": monId, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "authors:Author": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "researches_hasauthor_authors": {},
      "researches_has_knowledges": {},
      "knowledges_belongsto_monument": {},
    });

    var query_cultures = JSON.stringify({
      "monument:Monument": {"id": monId},
      "knowledges:Knowledge": {"id": "*"},
      "cultures:Culture": {"id": "*", "select": "*"},
      "knowledges_belongsto_monument": {},
      "knowledges_has_cultures": {},
    });

    var query_research_types = JSON.stringify({
      "monument:Monument": {"id": monId},
      "researches:Research": {"id": "*"},
      "knowledges:Knowledge": {"id": "*"},
      "resType:ResearchType": {"id": "*", "select": "*"},
      "researches_has_knowledges": {},
      "researches_has_resType": {},
      "knowledges_belongsto_monument": {},
    });

    var query_epoch = JSON.stringify({
      "monument:Monument": {"id": monId},
      "epoch:Epoch": {"id": "*", "select": "*"},
      "monument_has_epoch": {},
    })

    var query_reports = JSON.stringify({
      "research:Research": {"id": "NEED"},
      "report:Report": {"id": "*", "select": "*"},
      "author:Author": {"id": "*"},
      "research_hasreport_report": {},
      "research_hasauthor_author": {},
      "report_hasauthor_author": {}
    });

    var query_excavations = JSON.stringify({
      "monument:Monument": {"id": monId},
      "r:Research": {"id": "NEED"},
      "exc:Excavation": {"id": "*", "select": "*"},
      "monument_has_exc": {},
      "r_has_exc": {},
    })

    var query_artifacts = JSON.stringify({
      "knowledge:Knowledge": {"id": "NEED"},
      "artifacts:Artifact": {"id": "*", "select": "*"},
      "knowledge_founded_artifacts": {}
    });

    $.when(App.models.fn.sendQueryWithPromise(query_main_info)).then(function(response) {
      _.extend(tmplData, response);

      var researchIds = _.map(tmplData.researches, function(res) {return res.id.toString()});
      var knowledgeIds = _.map(tmplData.knowledges, function(know) {return know.id.toString()});

      $.when(App.models.fn.sendQueriesWithDeferred(query_reports, researchIds, d1)).then(function(response) {
        tmplData.reports = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_excavations, researchIds, d2)).then(function(response) {
        tmplData.excavations = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_artifacts, knowledgeIds, d3)).then(function(response) {
        tmplData.artifacts = response;
      });
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_research_types, d4)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_epoch, d5)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_cultures, d6)).then(function(response) {
      _.extend(tmplData, response);
    })

    $.when(d1, d2, d3, d4, d5, d6).done(function() {
      var names = {};
      _.each(tmplData.knowledges, function(k, id) {
        (names[k.monument_name]) ? names[k.monument_name]++ : names[k.monument_name] = 1;
      })
      tmplData.mainName = _(names).invert()[_(names).max()];
      tmplData.allNames = _.keys(names).join(', ');
      tmplData.placemarks = [];

      _.each(tmplData.excavations, function(resExc, resId) {
        _.each(resExc, function(exc, excId) {
          tmplData.placemarks.push({
            "coords": [exc.x, exc.y],
            "pref": {
              "hintContent": exc.name,
              "iconContent": `${resId+1}-${excId+1}`
            }
          })
        })
      })

      _.each(tmplData.knowledges, function(know, knowId) {
        tmplData.placemarks.push({
          "coords": [know.x, know.y],
          "pref": {
            "hintContent": know.monument_name,
            "iconContent": knowId+1
          }
        })
      })

      console.log(tmplData);
      App.page.render("monument/show", tmplData)
    });
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
      'oknInputOptions': {
        'source': App.models.Okn.findByNamePrefix,
        'etl': function(okns) {
          return _.map(okns, okn => ({'id': okn.id, 'label': okn.name}));
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
