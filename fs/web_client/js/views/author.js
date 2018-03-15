'use strict';

App.views.author = new (Backbone.View.extend({
  'show': (placemarks) => {
    App.views.addToMap(placemarks);

    App.views.functions.setAccordion("#accordion");
    $('.tabs').tabs();

    App.views.functions.setEdit();
  }
}));