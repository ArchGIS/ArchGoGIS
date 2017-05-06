'use strict';

App.controllers.main = new (Backbone.View.extend({
  'index': () => {
    let query = JSON.stringify({
      "counts": [
        "Heritage",
        "Monument",
        "Research",
        "Artifact",
        "Radiocarbon",
        "Report",
        "Monography",
        "Article",
        "ArchiveDoc",
        "Author"
      ]
    });

    $.post({
      url: '/search/count',
      data: query,
      success: function(counts) {
        App.page.render('mainpage', {'count': JSON.parse(counts)});
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      }
    })
  }
}));