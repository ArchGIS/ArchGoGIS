'use strict';

App.views.excavation = new (Backbone.View.extend({
  "show": function(argument) {
    App.views.map();
    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");
  },
}));
