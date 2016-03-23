'use strict';

App.controllers.research = new (App.View.extend({
  'new': function() {
    App.page.render('research');
  },

  'show': function() {
    App.url.setMapping(['id']);
    var id = App.url.get("id");

    var query = JSON.stringify({
      "r:Research": {"id": id, "select": "*"},
      "k:Knowledge": {"id": "*", "select": "*"},
      "m:Monument": {"id": "*", "select": "*"},
      "r_Contains_k": {},
      "k_Describes_m": {}
    });

    $.post('/hquery/read?limit=400', query)
    .success(function(researchData) {
      researchData = JSON.parse(researchData);

      var query = JSON.stringify({
        "r:Research": {"id": id},
        "a:Author": {"id": "?", "select": "*"},
        "a_Created_r": {}
      });

      $.post('/hquery/read', query)
      .success(function(authorData) {
        authorData = JSON.parse(authorData);
        App.page.render('research_view', $.extend(researchData, authorData));
      });
    });
  }
}));
