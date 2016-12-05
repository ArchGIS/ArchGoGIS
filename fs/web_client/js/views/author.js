'use strict';

App.views.author = new (Backbone.View.extend({
  "show": function(argument) {
    App.views.functions.setAccordion("#accordion");
    $('.tabs').tabs();
  },
}))