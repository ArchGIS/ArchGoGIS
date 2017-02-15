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
        $('#report-city-input').on('autocompleteselect', function(event, ui) {
          citySelectHandler(event, ui);
        });
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

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      let localMonId = monId++;

      App.template.get("research/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl({'monId': localMonId, 'needHeader': true}));

        App.views.functions.setAccordionHeader($(`#monument-header-${localMonId}`));

        $(`#monument-name-input-${localMonId}`).on("change", function() {
          let monName = $(this).val();
          $(`.mon-name-${localMonId}`).text(`${monName}: `)
        })

        _.each($(".exc-belongs"), function(obj, key) {
          let monName = "Без названия";
          let excId = $(obj).attr("data-exc-id");
          let monLayers = App.views.functions.addMonRelation("exc", localMonId, monName);
          let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, localMonId);
          monLayers.append(checkbox);
          $(obj).append(monLayers);
        })

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
            let layerCounter2 = App.fn.counter(1);

            let monLayers = $(`.mon-checkboxes-${localMonId}`);
            monLayers.find("input").remove();
            $(`#monument-name-input-${localMonId}`).trigger("change");

            let $button = $(`#add-layer-button-${localMonId}`);
            $button.on("click", () => App.views.functions.addLayer($button, localMonId, layerCounter()));
            $button.on("click", () => {
              let layerId = layerCounter2();
              _.each(monLayers, function(layers, excId) {
                let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, localMonId, layerId);
                $(layers).append(checkbox);
              })
            });
            $button.trigger("click");

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

    let excCounter = App.fn.counter(1);
    $("#add-exc-button").on('click', function(e) {
      let excId = excCounter();

      $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
        _.each($(".monument-content"), function(obj, monId) {
          let monName = $(obj).find(".monument-name").val() || "Без названия";
          let layers = $(obj).find(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", monId+1, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId+1, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId+1)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    });

    $("#container").tabs();
  },

  "new_by_pub": function() {
    let coordpicker = App.blocks.coordpicker;
    let fmt = App.fn.fmt;
    let excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;
    let repSelName = '';
    let objectId = "m_1";
    
    const map = App.views.map().map;

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#mon-type-selector"), "MonumentType");

    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: map
    });

    let authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Publication.findByAuthorId(ui.item.id).then(function(pubs) {
        $('#pub-input').autocomplete({
          source: _.map(pubs.pub, function(pub, key) {
            return {'label': `${pub.name} (${pub.published_at})`, 'id': pub.id, 'resId': pubs.res[key].id}
          })
        });
      });

      $("#pub-input").autocomplete({
        source: [],
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var lastSelectedAuthorId = 0;
    var lastSelectedAuthorName = '';
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
        tmpl = _.template( $('script.add-pub').html() );
        $('.find-pub').replaceWith( tmpl() );
        $('#author-birth-date-input').on('keyup mouseup', App.fn.checkYear);

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#pub-type-selector"), "PublicationType");
        getDataForSelector($("#edi-type-selector"), "EditionType");
        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
      }
    });

    $('#pub-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#pub-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $('#pub-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-pub').html() );

        $input.parent().replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#pub-type-selector"), "PublicationType");
        getDataForSelector($("#edi-type-selector"), "EditionType");
        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      } else {
        $("#research-input-id").val(ui.item.resId);
        $("#pub-input-id").val(ui.item.id);
        repSelName = ui.item.name;
      }
    });

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      let localMonId = monId++;

      App.template.get("research/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl({'monId': localMonId, 'needHeader': true}));

        App.views.functions.setAccordionHeader($(`#monument-header-${localMonId}`));

        $(`#monument-name-input-${localMonId}`).on("change", function() {
          let monName = $(this).val();
          $(`.mon-name-${localMonId}`).text(`${monName}: `)
        })

        _.each($(".exc-belongs"), function(obj, key) {
          let monName = "Без названия";
          let excId = $(obj).attr("data-exc-id");
          let monLayers = App.views.functions.addMonRelation("exc", localMonId, monName);
          let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, localMonId);
          monLayers.append(checkbox);
          $(obj).append(monLayers);
        })

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
            let layerCounter2 = App.fn.counter(1);

            let monLayers = $(`.mon-checkboxes-${localMonId}`);
            monLayers.find("input").remove();
            $(`#monument-name-input-${localMonId}`).trigger("change");

            let $button = $(`#add-layer-button-${localMonId}`);
            $button.on("click", () => App.views.functions.addLayer($button, localMonId, layerCounter()));
            $button.on("click", () => {
              let layerId = layerCounter2();
              _.each(monLayers, function(layers, excId) {
                let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, localMonId, layerId);
                $(layers).append(checkbox);
              })
            });
            $button.trigger("click");

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
    
    let excCounter = App.fn.counter(1);
    $("#add-exc-button").on('click', function(e) {
      let excId = excCounter();

      $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
        _.each($(".monument-content"), function(obj, monId) {
          let monName = $(obj).find(".monument-name").val() || "Без названия";
          let layers = $(obj).find(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", monId+1, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId+1, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId+1)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
    });

    $("#container").tabs();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })

    function fillResearchInputs() {
      let year = $("#pub-year-input").val();
      let name = $("#pub-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
      $("#research-input-year").val(year);
    };

    $('#send-button').on('click', function() {
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery("rs");
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },

  "getFullResearchTitle": function(authorName, resYear, resType) {
    return [
      (authorName || "Неизвестный автор"),
      (resType || "без типа"),
      (resYear || "год не указан")
    ].join(", ");
  }
}));
