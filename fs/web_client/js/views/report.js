'use strict';

App.views.report = new (Backbone.View.extend({
  "show": function(argument) {
    $(".view-icon").on('click', function() {
      let fileid = $(this).attr('fileid');
      $("#report-view-file").attr('src', (App.models.File.url(fileid)));
    }, this)
  },
}))