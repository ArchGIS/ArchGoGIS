'use strict';

App.views.excavation = new (Backbone.View.extend({
  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");

    App.views.functions.setEdit();
  },
}));
