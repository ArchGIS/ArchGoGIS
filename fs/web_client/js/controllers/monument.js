'use strict';

App.controllers.monument = new (App.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get('id');

    var query = JSON.stringify({
      "monument:Monument": {"id": id, "select": "*"},
      "researches:Research": {"id": "*", "select": "*"},
      "authors:Author": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "cultures:Culture": {"id": "*", "select": "*"},
      "epochs:Epoch": {"id": "*", "select": "*"},
      "researches_hasauthor_authors": {},
      "researches_has_knowledges": {},
      "knowledges_belongsto_monument": {},
      "knowledges_has_cultures": {},
      "knowledges_has_epochs": {},
    });

    $.post("/hquery/read", query).success(function(data) {
      data = JSON.parse(data);
      data.placemarks = [];
      data.artifacts = [];
      data.reports = [];

      var d1 = $.Deferred();
      var d2 = $.Deferred();

      $.each(data.researches, function(id, research) {
        query = JSON.stringify({
          "research:Research": {"id": research.id+""},
          "report:Report": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "research_hasreport_report": {},
          "research_hasauthor_author": {},
          "report_hasauthor_author": {}
        });

        $.post("/hquery/read", query).success(function(report) {
          report = JSON.parse(report);
          data.reports.push(report);
          if (data.researches.length == id+1) {
            d1.resolve();
          }
        })
      })

      $.each(data.knowledges, function(id, knowledge) {
        query = JSON.stringify({
          "knowledge:Knowledge": {"id": knowledge.id+""},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "knowledge_founded_artifacts": {}
        });

        $.post("/hquery/read", query).success(function(artifacts) {
          artifacts = JSON.parse(artifacts);
          data.artifacts.push(artifacts.artifacts);
          if (data.knowledges.length == id+1) {
            d2.resolve();
          }
        })

        data.placemarks.push({
          "coords": [knowledge.x, knowledge.y],
          "pref": {
            "hintContent": knowledge.monument_name,
            "iconContent": id+1
          }
        })
      });

      console.log(data);
      $.when(d1, d2).done(App.page.render("monument_view", data));
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
