'use strict';

App.views.wizard = new (App.View.extend({
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
        "#monument/new": t("report.singular")
      },
      "monuments": {
        "#monument/new_by_arch_map": t("arch-map.singular")
      },
      "artifact": {
        "#artifact/new": t("research.singular")
      }
    };
    
    $("#what-create").on('change', function(obj) {
      var val = $("#what-create").val();
      
      $sources.empty();
      $.each(options[val], function(href, text) {
        $sources.append($("<option/>").attr("value", href).text(text));
      });
    })
  }
}));
