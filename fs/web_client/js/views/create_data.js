
'use strict';

App.views.wizard = new (Backbone.View.extend({
  'create_data': function() {
    var $sources = $("#from-what-create");
    var t = App.locale.translate;

    $("#goto-create").on("click", function() {
      var $selectedSource = $sources.find(":selected");
      
      if ($selectedSource.text()) {
        window.location.href = $selectedSource.attr("value");
      }
    });

    var options = {
      "monument": {
        "#monument/new": t("report.singular"),
        "#monument/new_by_pub": t("publication.singular")
      },
      "artifact": {
        "#artifact/new_by_report": t("report.singular")
      },
      "research": {
        "#research/new": t("report.singular")
      },
      "heritage": {
        "#heritage/new": t("doc.registration.singular")+"/"+t("doc.surveyMap.singular")
      }
    };
    
    $("#what-create").on('change', function(obj) {
      var val = $("#what-create").val();
      
      $sources.empty();
      $.each(options[val], function(href, text) {
        $sources.append($("<option/>").attr("value", href).text(text));
      });
    })

    $("#what-create").trigger("change");
  }
}));
