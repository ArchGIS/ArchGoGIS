'use strict';

App.views.research = new (Backbone.View.extend({
  "show": function(placemarks) {
    const types       = _.uniq( _.pluck(placemarks, 'type') ),
          mapInstance = App.views.map(types),
          map         = mapInstance.map,
          overlays    = mapInstance.overlayLayers;

    _.each(placemarks, function(item) {
      const pathToIcon = `/web_client/img/${item.type === 'monument' ? 'resTypes' : 'excTypes'}`;
      const icon = L.icon({
        iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
        iconSize: [16, 16]
      });

      let marker = L.marker(new L.LatLng(item.coords[0], item.coords[1]), {
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

      overlays[item.type].addLayer(marker);
    });

    App.views.functions.setAccordion("#accordion");
    $('#container').tabs();
  },

  "new": function(argument) {
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;

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
        map: 'map'
      }, `${monId}-${counter}`);
    }

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      var newMonument = $(`
      <h4 class="accordion-header" id="monument-header-${monId}">
        <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>
        Памятник №${monId}
      </h4>
      <div class="accordion-content">

        <div class="form-group find-monument-${monId}">
          <label>Выбрать существующий памятник <span class="required">*</span></label>
          <input class="form-control" id="monument-input-${monId}"></input>
          <input id="monument-input-id-${monId}" data-for="m_${monId}:Monument" hidden type="id" name="id" data-req="up"></input>
        </div>


        <div class="form-group">
          <label for="monument-name-input-${monId}">Название памятника <span class="required">*</span></label>
          <input class="form-control" id="monument-name-input-${monId}" data-for="k_${monId}:Knowledge" type="text" name="monument_name" data-req></input>
        </div>
        <div class="form-group">
          <label for="monument-desc-input-${monId}">Описание памятника</label>
          <textarea class="form-control" id="monument-desc-input-${monId}" data-for="k_${monId}:Knowledge" type="text" name="description"></textarea>
        </div>
        

        <div class="form-group find-culture-${monId}">
          <label for="culture-input-${monId}">Выберите культурную принадлежность</label>
          <input id="culture-input-${monId}" class="form-control">
          <input id="culture-input-id-${monId}" hidden data-for="c_${monId}:Culture" type="id" name="id">
        </div>

        <div id="coord-picker-${monId}" class="coords">
          <div class="form-group">
            <label for="monument-x-${monId}">
              Координата x
            </label>
            <input class="form-control" id="monument-x-${monId}" data-for="k_${monId}:Knowledge" type="number" name="x"></input>
          </div>
          <div class="form-group">
            <label for="monument-y-${monId}">
              Координата y
            </label>
            <input class="form-control" id="monument-y-${monId}" data-for="k_${monId}:Knowledge" type="number" name="y"></input>
          </div>
        </div>
        <br>
        <div class="form-group">
          <h4 for="report-input">Археологические вскрытия:</h4>
        </div>
      </div>

      <!-- Форма для нового памятника -->
      <script type="text/template" class="add-monument-${monId}">
        <h4>Добавление нового памятника</h4>
        <div class="form-group">
          <input id="monument-tmp-input-${monId}" value="Костыль" hidden data-for="m_${monId}:Monument" type="text" name="tmp"></input>
        </div>

        <div class="form-group">
          <label for="epoch-selector-${monId}">Эпоха</label>
          <select class="form-control" id="epoch-selector-${monId}" data-for="e_${monId}:Epoch" type="id" name="id"></select>
        </div>
        <div class="form-group">
          <label for="mon-type-selector-${monId}">Тип</label>
          <select class="form-control" id="mon-type-selector-${monId}" data-for="mt_${monId}:MonumentType" type="id" name="id"></select>
        </div>
      </script>

      <!-- Форма для новой культуры -->
      <script type="text/template" class="add-culture-${monId}">
        <div class="form-group">
          <label for="culture-name-input-${monId}">Новая культурная принадлежность</label>
          <input id="culture-name-input-${monId}" class="form-control" data-for="c_${monId}:Culture" type="text" name="name">
        </div>
      </script>
      `);

      $(this).before(newMonument);
      getDataForSelector($(`#epoch-selector-${monId}`), "Epoch");
      getDataForSelector($(`#mon-type-selector-${monId}`), "MonumentType");
      setSelectsEvents();

      var coordpicker = App.blocks.coordpicker;
      coordpicker($('#coord-picker-'+monId), {
        inputs: ['#monument-x-'+monId, '#monument-y-'+monId],
        map: 'map'
      }, monId);

      $(`#monument-header-${monId}`).next().append(`
        <button id="add-exc-button-${monId}" class="btn btn-primary">
          <i class="fa fa-cogs"></i>
          Добавить раскоп
        </button>
      `);

      (function () {
        var counter = counter || 1;
        let localMonId = monId;
        $(`#add-exc-button-${localMonId}`).on('click', function(e) {
          addNewCoords($(this), localMonId, counter++)
        });

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

            $('#' + addName(id)).val(inputValue);

            fillSelector($(`#epoch-selector-${localMonId}`), App.store.selectData.Epoch);
            fillSelector($(`#mon-type-selector-${localMonId}`), App.store.selectData.MonumentType);
          } else if (lastSelectedAuthorId != ui.item.id) {
            lastSelectedMonId = ui.item.id;
            $(`#monument-input-id-${localMonId}`).val(lastSelectedMonId);
            monSelName = ui.item.name;
          }
        });


        let d_culture = $.Deferred();
        (function() {
          let query = {};
          query['rows:Culture'] = {"id": "*", "select": "*"};
          query = JSON.stringify(query);

          $.post("/hquery/read", query).success((response) => {
            App.store.selectData.Culture = JSON.parse(response);
            d_culture.resolve();
          });
        }());

        $.when( d_culture ).done(() => {
          let items = _.map(App.store.selectData.Culture.rows, culture => ({'id': culture.id, 'label': culture.name}));
          let grepObject = App.fn.grepObject;

          $(`#culture-input-${localMonId}`).autocomplete({
            source: function(req, res) {
              let term = req.term.toLowerCase();
              
              res(grepObject(term, items, 'label'));
            },
            minLength: 0
          }).focus(function() {
            $(this).autocomplete("search");
          });
        });

        $(`#culture-input-${localMonId}`).on('autocompletefocus', function(event, ui) {
          event.preventDefault();
        });

        $(`#culture-input-${localMonId}`).on('autocompleteresponse', function(event, ui) {
          if (ui.content.length === 0) {
            ui.content.push({
              'value': 'Ничего не найдено. Добавить?',
              'label': 'Ничего не найдено. Добавить?'
            });
          }
        });
        
        $(`#culture-input-${localMonId}`).on('autocompleteselect', function(event, ui) {
          if (ui.item.value === 'Ничего не найдено. Добавить?') {
            let $input = $(this);
            let id = $input.attr('id');
            let inputValue = $input.val();

            let tmpl = _.template( $(`script.add-culture-${localMonId}`).html() );
            $(`.find-culture-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            $('#' + addName(id)).val(inputValue);
          } else {
            $(`#culture-input-id-${localMonId}`).val(ui.item.id);
          }
        });
      })();

      // validate(`monument-input-${monId}`, monSelName);

      App.views.functions.setAccordionHeader($(`#monument-header-${monId}`));
      monId++;
    });

    var excCounter = 1;
    $("#add-exc-button-0").on('click', function(e) {
      addNewCoords($(this), 0, excCounter++);
    });

    $('#add-exc-button').trigger("click");

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    });

    $("#container").tabs();
  },

  "getFullResearchTitle": function(authorName, resYear, resType) {
    return [
      (authorName || "Неизвестный автор"),
      (resYear || "год не указан"),
      (resType || "без типа")
    ].join(", ");
  }
}));
