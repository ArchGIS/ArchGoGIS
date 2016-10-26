'use strict';


App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research', {
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
    var resId = App.url.get("id");
    var tmplData = {
      "epochs": [],
      "cultures": [],
      "artifacts": [],
      "reports": [],
      "excavations": [],
      "placemarks": [],
      "usedArtifacts": [],
      "coauthors": []
    };

    var d1 = $.Deferred(),
        d2 = $.Deferred(),
        d3 = $.Deferred(),
        d4 = $.Deferred(),
        d5 = $.Deferred(),
        d6 = $.Deferred(),
        d7 = $.Deferred(),
        d8 = $.Deferred(),
        d9 = $.Deferred();

    var query_author = JSON.stringify({
      "research:Research": {"id": resId, "select": "*"},
      "author:Author": {"id": "*", "select": "*"},
      "research_hasauthor_author": {},
    });

    var query_monuments = JSON.stringify({
      "research:Research": {"id": resId},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "monuments:Monument": {"id": "*", "select": "*"},
      "research_has_knowledges": {},
      "knowledges_belongsto_monuments": {},
    });

    var query_epochs = JSON.stringify({
      "monuments:Monument": {"id": "NEED"},
      "epoch:Epoch": {"id": "*", "select": "*"},
      "monuments_has_epoch": {},
    });

    var query_cultures = JSON.stringify({
      "knowledges:Knowledge": {"id": "NEED"},
      "cultures:Culture": {"id": "*", "select": "*"},
      "knowledges_has_cultures": {},
    });

    var query_research_type = JSON.stringify({
      "research:Research": {"id": resId},
      "resType:ResearchType": {"id": "*", "select": "*"},
      "research_has_resType": {},
    })

    var query_coauthors = JSON.stringify({
      "research:Research": {"id": resId},
      "coauthors:Author": {"id": "*", "select": "*"},
      "research_hascoauthor_coauthors": {},
    });

    var query_reports = JSON.stringify({
      "research:Research": {"id": resId},
      "author:Author": {"id": "*"},
      "reports:Report": {"id": "*", "select": "*"},
      "reports_hasauthor_author": {},
      "research_hasreport_reports": {}
    });

    var query_used_artifacts = JSON.stringify({
      "research:Research": {"id": resId},
      "knowledges:Knowledge": {"id": "*"},
      "usedArtifacts:Artifact": {"id": "*", "select": "*"},
      "knowledges_has_usedArtifacts": {},
      "research_has_knowledges": {}
    });

    var query_excavations = JSON.stringify({
      "m:Monument": {"id": "NEED"},
      "r:Research": {"id": resId},
      "exc:Excavation": {"id": "*", "select": "*"},
      "m_has_exc": {},
      "r_has_exc": {}
    });

    var query_founded_artifacts = JSON.stringify({
      "knowledge:Knowledge": {"id": "NEED"},
      "artifacts:Artifact": {"id": "*", "select": "*"},
      "knowledge_founded_artifacts": {}
    });

    $.when(App.models.fn.sendQueryWithPromise(query_monuments)).then(function(response) {
      _.extend(tmplData, response);

      var monumentIds = _.map(tmplData.monuments, function(mon) {return mon.id.toString()});
      var knowledgeIds = _.map(tmplData.knowledges, function(know) {return know.id.toString()});

      $.when(App.models.fn.sendQueriesWithDeferred(query_epochs, monumentIds, d1)).then(function(response) {
        tmplData.epochs = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_cultures, knowledgeIds, d2)).then(function(response) {
        tmplData.cultures = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_excavations, monumentIds, d8)).then(function(response) {
        tmplData.excavations = response;
      });
      $.when(App.models.fn.sendQueriesWithDeferred(query_founded_artifacts, knowledgeIds, d9)).then(function(response) {
        tmplData.artifacts = response;
      });
    })

    $.when(App.models.fn.sendQueryWithDeferred(query_author, d3)).then(function(response) {
      _.extend(tmplData, response);
    });

    $.when(App.models.fn.sendQueryWithDeferred(query_research_type, d4)).then(function(response) {
      _.extend(tmplData, response);
    });

    $.when(App.models.fn.sendQueryWithDeferred(query_coauthors, d5)).then(function(response) {
      _.extend(tmplData, response);
    });

    $.when(App.models.fn.sendQueryWithDeferred(query_reports, d6)).then(function(response) {
      _.extend(tmplData, response);
    });

    $.when(App.models.fn.sendQueryWithDeferred(query_used_artifacts, d7)).then(function(response) {
      _.extend(tmplData, response);
    });


    $.when(d1, d2, d3, d4, d5, d6, d7, d8, d9).done(function() {
      console.log(tmplData);

      _.each(tmplData.knowledges, function(k, kid) {
        tmplData.placemarks.push({
          "coords": [k.x, k.y],
          "pref": {
            "hintContent": k.monument_name,
            "iconContent": kid+1
          }
        })
      })

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
      console.log(tmplData.epochs);
      console.log(tmplData.cultures);
      App.page.render('research/show', tmplData)
    });
  }
}));