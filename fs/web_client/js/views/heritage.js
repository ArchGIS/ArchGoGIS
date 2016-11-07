'use strict';

App.views.heritage = new (App.View.extend({
  "new": function(argument) {
    $("#container").tabs();
    var coordpicker = App.blocks.coordpicker;

    coordpicker($('#coord-picker'), {
      inputs: ['#heritage-x', '#heritage-y'],
      map: 'map'
    });

    $(".date-picker").datepicker({
      dateFormat: "dd.mm.yy"
    });

    var $heritageFile = $('#heritage-file-input');
    $heritageFile.change(App.fn.checkFileSize.bind($heritageFile, 50));

    var mapId = 1;
    $('#add-map-button').on('click', function(e) {
      var localMapId = mapId;
      var params = {
        mapId: localMapId
      }

      App.template.get("heritage/addSurveyMap", function(tmpl) {
        $('#add-map-button').before(tmpl(params));
        $(`#map${localMapId}`).tabs({active: $(this).attr("active")});

        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });

        App.views.functions.setAccordionHeader($(`#map-header-${localMapId}`));
      })
      mapId++;
    });

    setSelectsEvents();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },
}));