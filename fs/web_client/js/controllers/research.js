'use strict';


App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = JSON.stringify({
      "research:Research": {"id": id, "select": "*"},
      "author:Author": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*"},
      "monuments:Monument": {"id": "*", "select": "*"},
      "epochs:Epoch": {"id": "*", "select": "*"},
      "cultures:Culture": {"id": "*", "select": "*"},
      "research_hasauthor_author": {},
      "research_has_knowledges": {},
      "knowledges_belongsto_monuments": {},
      "knowledges_has_cultures": {},
      "knowledges_has_epochs": {},
    });

    var query_for_reports = JSON.stringify({
      "research:Research": {"id": id, "select": "*"},
      "author:Author": {"id": "*", "select": "*"},
      "reports:Report": {"id": "*", "select": "*"},
      "reports_hasauthor_author": {},
      "research_hasreport_reports": {}
    });

    var d = $.Deferred();
    var data = {};
    $.post('/hquery/read', query).success(function(researchData) {
      data = JSON.parse(researchData);
      data['reports'] = {};
      data['artifacts'] = [];
      data['placemarks'] = [];

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
            d.resolve();
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

      $.post('/hquery/read', query_for_reports).success(function(researchD) {

        _.extend(data, JSON.parse(researchD));
        console.log(data);
        $.when(d).done(App.page.render('research_view', data));
      });
    });
  }
}));