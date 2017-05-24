'use strict';

App.views.selection = new (Backbone.View.extend({
  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");

    $("#get-all-radiocarbon").on("click", function() {
      console.log(123)

      var type = 'data:application/octet-stream;base64, ';
      var text = 'jxowsjsivneic';
      var base = btoa(text);
      var res = type + base;
      document.getElementById('test').href = res;
    }) 
  },
}))