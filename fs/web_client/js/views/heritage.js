'use strict';

App.views.heritage = new (Backbone.View.extend({
  "new": function(argument) {
    $("#container").tabs();
    var coordpicker = App.blocks.coordpicker;

    const map = App.views.map().map;

    coordpicker($('#coord-picker'), {
      inputs: ['#heritage-x', '#heritage-y'],
      map: map
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

          $(`#state${localMapId} .map-row-exist`).on("change", function() {
            var value = ($(this).val() == 0) ? true : false;
            $(this).parentsUntil("tbody").last().find(".map-table-row").prop("disabled", value)
          })
        })
        console.log($(`#map-own-type-selector-${localMapId}`))
        getDataForSelector($(`#map-own-type-selector-${localMapId}`), "OwnType");
        getDataForSelector($(`#map-disposal-type-selector-${localMapId}`), "DisposalType");
        getDataForSelector($(`#map-purpose-selector-${localMapId}`), "FunctionalPurpose");
        getDataForSelector($(`#map-availability-selector-${localMapId}`), "Availability");
        getDataForSelector($(`#map-usage-type-selector-${localMapId}`), "UsageType");
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

        getDataForSelector($(`#photo-view-selector-${localPhotoId}`), "CardinalDirection");
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

        inputVal = inputVal || "Не указано";
        var displays = $(`[data-from=${inputId}]`);
        displays.text(inputVal);
      })
    })

    function selectDoc() {
      let type = $("#heritage-doc-type-input").val();
      let num = $("#heritage-doc-num-input").val();
      let date = $("#heritage-doc-date-input").val();

      let docs = App.models.File.findDocForHeritage(type, num, date);
      let docSelector = $("#heritage-doc-selector")

      $.when(docs).then(function(response) {
        docSelector.html("");

        _.each(response, function(row, key) {
          row.name = `"${row.docType}" № "${row.docNum}" от "${row.docDate}"`;
        })

        fillSelector(docSelector, response);
      })
    }

    $("#heritage-doc-type-input").on("change", function() {
      selectDoc();
    })
    $("#heritage-doc-num-input").on("change", function() {
      selectDoc();
    })
    $("#heritage-doc-date-input").on("change", function() {
      selectDoc();
    })
    $("#select-doc-checkbox").on("change", function() {
      let attrValue = "";
      if ($(this).is(":checked") === false) {
        attrValue = "file:File";
      } 

      $("#heritage-doc-type-input").attr("data-for", attrValue);
      $("#heritage-doc-num-input").attr("data-for", attrValue);
      $("#heritage-doc-date-input").attr("data-for", attrValue);
    })

    var monId = 1;
    var excludeIdent = App.fn.excludeIdentMonuments;
    $('#add-monument-button').on('click', function(e) {
      var localMonId = monId;
      var params = {
        monId: localMonId
      }

      App.template.get("heritage/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl(params));

        console.log(`#monument-input-${localMonId}`);

        (function () {
          $(`#monument-input-${localMonId}`).autocomplete({
            source: function(request, response) {
              var monuments = [];
              
              App.models.Monument.findByNamePrefix(request.term)
                .then(function(data) {
                  if (data && !data.error) {
                    let results = _.map(excludeIdent(data), function(row) {
                      return {'label': `${row.monName} (${row.epName}, ${row.monType})`, 'id': row.monId}
                    });

                    if (!results.length) {
                      results.push('Памятников с таким названием нет');
                    }

                    response(results);
                  } else {
                    response();
                  }
                });
            },
            minLength: 3
          }).focus(function(){
            $(this).autocomplete("search");
          });

          $(`#monument-input-${localMonId}`).on('autocompletefocus', function(event, ui) {
            event.preventDefault();
          });

          let lastSelectedMonId = 0;
          let monSelName = '';
          $(`#monument-input-${localMonId}`).on('autocompleteselect', function(event, ui) {
            if (typeof ui.item.id != 'undefined') {
              $(`#monument-input-id-${localMonId}`).val(ui.item.id);
            } else {
              $(`#monument-input-id-${localMonId}`).val("");
              event.preventDefault();
            }
          });
        })();
      })

      monId++;
    });
    
    let nextTopoId = App.fn.counter(1);
    $('#add-topoplan-button').on('click', function(e) {
      let localTopoId = nextTopoId();
      let params = {
        topoId: localTopoId
      }

      App.template.get("heritage/addTopoplan", function(tmpl) {
        $('#add-topoplan-button').before(tmpl(params));

        App.views.functions.setAccordionHeader($(`#topo-header-${localTopoId}`));
      })
    });

    getDataForSelector($("#heritage-status-selector"), "HeritageStatus");
    getDataForSelector($("#heritage-security-type-selector"), "SecurityType");
    setSelectsEvents();

    $('#send-button').on('click', function() {
      if ( isValidForm() ) {
        postQuery("heritage");
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },

  'show': function(arg) {
    App.views.addToMap(arg.placemarks);
    
    console.log(arg)
    _.each(arg.stateTables, function(table, id) {
      App.template.get("heritage/stateTable", function(tmpl) {
        $(`#state${id}`).append(tmpl({mapId: id}));

        var rows = $(`#map-table-${id}`).find("tr:gt(0)");
        _.each(rows, function(row, rowNum) {
          for (let i=0; i<5; i++) {
            $(row).append(`<td class="map-table-row">${table[rowNum][i]}</td>`)
          }
        })
      });
    })

    $(".tabs").tabs();
    App.views.functions.setAccordion(".accordion");
  }
}));