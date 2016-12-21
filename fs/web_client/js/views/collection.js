'use strict';

App.views.collection = new (Backbone.View.extend({
  "show": function(argument) {
    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");
  },
}));
