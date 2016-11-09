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

        $("[data-has-display]").trigger("change");

        App.views.functions.setAccordionHeader($(`#map-header-${localMapId}`));
      })

      App.template.get("heritage/stateTable", function(tmpl) {
        $(`#state${localMapId}`).append(tmpl(params));

        App.template.get("heritage/tableRow", function(tmpl) {
          var rows = $(`#map-table-${localMapId}`).find("tr:gt(0)");
          _.each(rows, function(row, id) {
            $(row).append(tmpl({rowNum: id}))
          })
        })
      });

      mapId++;
    });

    var photoId = 1;
    $('#add-photo-button').on('click', function(e) {
      var localPhotoId = photoId;
      var params = {
        photoId: localPhotoId
      }

      App.template.get("heritage/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));

        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });

        App.views.functions.setAccordionHeader($(`#photo-header-${localPhotoId}`));
      })
      photoId++;
    });

    var $inputsWithDisplay = $("[data-has-display]");
    _.each($inputsWithDisplay, function(input, key) {
      $(input).on("change", function() {
        var inputId = $(this).attr("id");
        var inputVal;

        if ($(this).has("option").length) {
          inputVal = $(this).find("option:selected").text();
        } else {
          inputVal = $(this).val();
        }
        console.log(inputVal)
        inputVal = inputVal || "Не указано";
        var displays = $(`[data-from=${inputId}]`);
        displays.text(inputVal);
      })
    })

    setSelectsEvents();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },
}));