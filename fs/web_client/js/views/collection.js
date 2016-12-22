'use strict';

App.views.collection = new (Backbone.View.extend({
  "show": function(argument) {
    App.views.map();
    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");
  },
}));
