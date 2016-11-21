'use strict';

App.controllers.main = new (Backbone.View.extend({
  'index': () => {
    let query = JSON.stringify({
      "counts": [
        "Heritage",
        "Monument",
        "Research",
        "Artifact",
        "Report",
        "Monography",
        "Article",
        "ArchiveDoc",
        "Author"
      ]
    });

    $.post('/search/count', query)
      .success(function(counts) {
        console.log(counts);
        App.page.render('mainpage', {'count': JSON.parse(counts)});
      });
  }
}));