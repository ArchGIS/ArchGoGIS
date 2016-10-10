'use strict';


App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    // var query = JSON.stringify({
    //   "research:Research.getBy": +id,
    //   "author:Author.getBy": "research",
    //   "knowledge:MonumentAnalysis.getBy": "research",
    //   "monuments:Monument.getBy": "knowledge",
    //   "photos:Photo.getBy": "knowledge",
    //   "documents:Document.getBy": "knowledge"
    // });

    var query = JSON.stringify({
      "research:Research": {"id": id, "select": "*"},
      "author:Author": {"id": "*", "select": "*"},
      "knowledge:Knowledge": {"id": "*", "select": "*"},
      "monuments:Monument": {"id": "*", "select": "*"},
      "research_hasauthor_author": {},
      "research_has_knowledge": {},
      "knowledge_belongsto_monuments": {}
    });

    var query_for_reports = JSON.stringify({
      "research:Research": {"id": id, "select": "*"},
      "author:Author": {"id": "*", "select": "*"},
      "reports:Report": {"id": "*", "select": "*"},
      "reports_hasauthor_author": {},
      "research_hasreport_reports": {}
    });

    var result = {};
    $.post('/hquery/read', query).success(function(researchData) {
      result = JSON.parse(researchData);
      result['reports'] = {};

      $.post('/hquery/read', query_for_reports).success(function(researchD) {
        // var response = JSON.parse(researchD);
        // if (response.)
        // response['orgs'] = {};

        _.extend(result, JSON.parse(researchD));
        App.page.render('research_view', result);
      });
    });
  }
}));