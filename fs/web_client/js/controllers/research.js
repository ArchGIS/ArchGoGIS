'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = JSON.stringify({
      "research:Research.getBy": 74,
      "author:Author.getBy": "research",
      "knowledge:Knowledge.getBy": "research",
      "monuments:Monument.getBy": "knowledge",
      "photos:Photo.getBy": "knowledge",
      "documents:Document.getBy": "knowledge"
    });

    $.post('/hquery/read2', query).success(function(researchData) {
      console.log(researchData);
      App.page.render('research_view', researchData);
    });
  }
}));
