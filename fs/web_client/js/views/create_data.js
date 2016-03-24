'use strict';

App.views.wizard = new (App.View.extend({
  'create_data': function() {
    $("#what-create").on('change', function(obj) {
      var val = $("#what-create").val();
      if (val == "monument") {
        $("#from-what-create").html("<option value='report'>Отчет</option>");
        $("#goto-create").attr("href", "#monument/new");
      } else if (val == "artifact") {
        $("#from-what-create").html("<option value='research'>Исследование</option>");
        $("#goto-create").attr("href", "#artifact/new");
      }
      console.log($("#what-create").val())
    })
  }
}));