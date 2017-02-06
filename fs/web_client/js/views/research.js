'use strict';

App.views.research = new (Backbone.View.extend({
  "show": function(placemarks) {
    const types       = _.uniq( _.pluck(placemarks, 'type') ),
          mapInstance = App.views.map(types),
          map         = mapInstance.map,
          overlays    = mapInstance.overlayLayers;

    _.each(placemarks, function(item) {
      if (!item.coords[0] && !item.coords[1]) { return; }

      const pathToIcon = `/web_client/img/${App.store.pathToIcons[item.type]}`;
      const icon = L.icon({
        iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
        iconSize: [16, 16]
      });

      let marker = L.marker(L.latLng(item.coords[0], item.coords[1]), {
        icon: icon
      });

      marker.bindTooltip(item.pref.hintContent, {
        direction: 'top'
      });

      marker.on('mouseover', function(e) {
        this.openTooltip();
      });
      marker.on('mouseout', function(e) {
        this.closeTooltip();
      });
      marker.on('click', function(e) {
        location.hash = `${item.type}/show/${item.id}`
      });

      overlays[App.store.mapTypes[item.type]].addLayer(marker);
    });

    App.views.functions.setAccordion("#accordion");
    $('#container').tabs();
  },

  "new_by_report": function(argument) {
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;

    const map = App.views.map().map;

    var counter = 1;
    var reportName,
        orgName = '';
    var reportYear;
    
    getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
    setSelectsEvents();

    var fillResearchInputs = function() {
      if ($("#report-input-id").val()) {
        var year = reportYear;
        var name = reportName + " - " + year;
      } else {
        var year = $("#research-year-input").val();
        var name = $("#report-name-input").val() + " - " + year;
      }

      $("#research-name-input").val(name);
    };

    $('#send-button').on('click', function() {
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery('r');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports, function(r) {
            return {'label': `${r.name} (${r.year})`, 'id': r.id, 'year': r.year, 'name': r.name}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          reportName = ui.item.name;
          reportYear = ui.item.year;
          $("#report-input-id").val(ui.item.id);
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var citySelectHandler = function(event, ui) {
      $('#report-city-input-id').val(ui.item.id);

      App.models.Org.findByCityId(ui.item.id).then(function(orgs) {
        $('#report-organization-input').autocomplete({
          source: _.map(orgs, function(org) {
            return {'label': org.name, 'id': org.id}
          })
        });
      });

      $("#report-organization-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#report-organization-input-id").val(ui.item.id);
          orgName = ui.item.name;
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    let lastSelectedAuthorId = 0;
    let lastSelectedAuthorName = '';
    $('#author-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-author').html() );
        $('.find-author').replaceWith( tmpl() );
        tmpl = _.template( $('script.add-report').html() );
        $('.find-report').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
      }
    });


    $('#report-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#report-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $('#report-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-report').html() );

        $input.parent().replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
      }
    });


    var lastSelectedCityId = 0;
    var lastSelectedCityName = '';
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        lastSelectedCityName = ui.item.name;
        citySelectHandler(event, ui);
      }
    });


    // События для прослушивания размера файлов
    var checkFileSize = App.fn.checkFileSize;
    var $authorPhoto = $('#author-photo-input');
    $authorPhoto.change(checkFileSize.bind($authorPhoto, 10));

    var $reportDoc = $('#report-file-input');
    $reportDoc.change(checkFileSize.bind($reportDoc, 50));

    // События для выбора года из диапазона от 0 до текущего года
    var checkYear = App.fn.checkYear;
    var $authorYear = $('#author-birth-date-input');
    $authorYear.bind('keyup mouseup', checkYear.bind($authorYear));

    var $resYear = $('#research-year-input');
    $resYear.bind('keyup mouseup', checkYear.bind($resYear));

    var $repYear = $('#report-year-input');
    $repYear.bind('keyup mouseup', checkYear.bind($repYear));

    // Валидация полей с автокомплитом
    // var validate = App.fn.validInput;
    // validate('author-input', lastSelectedAuthorName);
    // validate('report-input', reportName);
    // validate('report-city-input', lastSelectedCityName);
    // validate('report-organization-input', orgName);


    function addCoord (name, monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
          .attr("for", name+id)
          .text(`Координата ${name}`))
        .append($("<input>")
          .addClass("form-control")
          .attr({
            "id": `${name}-${monId}-${id}`,
            "data-for": `exc_${monId}_${id}:Excavation`,
            "type": "number",
            "name": name
          })
        );
    }

    function addExcName(monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
          .attr("for", `excavation-name-input-${id}`)
          .text(`Название ${id}`))
        .append($("<input>")
          .addClass("form-control")
          .attr({
            "id": `excavation-name-input-${id}`,
            "data-for": `exc_${monId}_${id}:Excavation`,
            "type": "text",
            "name": "name"
          })
        );
    }

    function addExcBoss(monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
          .attr("for", `excavation-boss-input-${id}`)
          .text(`Руководитель работ`))
        .append($("<input>")
          .addClass("form-control")
          .attr({
            "id": `excavation-boss-input-${id}`,
            "data-for": `exc_${monId}_${id}:Excavation`,
            "type": "text",
            "name": "boss"
          })
        );
    }

    function addExcArea(monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
          .attr("for", `excavation-area-input-${id}`)
          .text(`Вскрытая площадь (м²)`))
        .append($("<input>")
          .addClass("form-control")
          .attr({
            "id": `excavation-area-input-${id}`,
            "data-for": `exc_${monId}_${id}:Excavation`,
            "type": "number",
            "name": "area"
          })
        );
    }

    function addNewCoords(btn, monId, counter) {
      var coords = $("<div>")
        .addClass("coords")
        .attr("id", `coord-picker-${monId}-${counter}`)
        .append(addCoord("x", monId, counter))
        .append(addCoord("y", monId, counter));

      btn.before(addExcName(monId, counter));
      btn.before(addExcBoss(monId, counter));
      btn.before(addExcArea(monId, counter));
      btn.before(coords);

      var coordpicker = App.blocks.coordpicker;
      coordpicker($(`#coord-picker-${monId}-${counter}`), {
        inputs: [`#x-${monId}-${counter}`, `#y-${monId}-${counter}`],
        map: map
      }, `${monId}-${counter}`);
    }

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      let localMonId = monId++;

      App.template.get("research/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl({'monId': localMonId}));

        App.views.functions.setAccordionHeader($(`#monument-header-${localMonId}`));

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
                    results.push('Ничего не найдено. Добавить?');
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
          if (ui.item.value === 'Ничего не найдено. Добавить?') {
            let $input = $(this);
            let id = $input.attr('id');
            let inputValue = $input.val();

            let tmpl = _.template( $(`script.add-monument-${localMonId}`).html() );
            $(`.find-monument-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            tmpl = _.template( $(`script#add-layer-${localMonId}`).html() );
            $(`#place-for-layers-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );


            $('#' + addName(id)).val(inputValue);

            var coordpicker = App.blocks.coordpicker;
            coordpicker($('#coord-picker-'+localMonId), {
              inputs: ['#monument-x-'+localMonId, '#monument-y-'+localMonId],
              map: map
            }, localMonId);

            let layerCounter = App.fn.counter(1);

            let $button = $(`#add-layer-button-${localMonId}`);
            $button.on("click", () => App.views.functions.addLayer($button, localMonId, layerCounter()))

            getDataForSelector($(`#epoch-selector-${localMonId}`), "Epoch");
            getDataForSelector($(`#mon-type-selector-${localMonId}`), "MonumentType");
          } else if (lastSelectedAuthorId != ui.item.id) {
            lastSelectedMonId = ui.item.id;
            $(`#monument-input-id-${localMonId}`).val(lastSelectedMonId);
            monSelName = ui.item.name;
          }
        });
        
        App.views.functions.setCultureAutocomplete($(`#culture-input-${localMonId}`), localMonId);
      })

      setSelectsEvents();
    });

    var excCounter = 1;
    $("#add-exc-button-0").on('click', function(e) {
      addNewCoords($(this), 0, excCounter++);
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    });

    $("#container").tabs();
  },

  "getFullResearchTitle": function(authorName, resYear, resType) {
    return [
      (authorName || "Неизвестный автор"),
      (resType || "без типа"),
      (resYear || "год не указан")
    ].join(", ");
  }
}));
