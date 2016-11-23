'use strict';

App.views.monument = new (Backbone.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    let addName = App.fn.addNameToId;
    
    var repSelName = '',
        heritageSelName = '',
        orgName = '';

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorIdFullInfo(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports.r, function(r, key) {
            return {'label': `${r.name} (${r.year}, ${reports.rt[key].name})`, 'id': r.id, 'resId': reports.res[key].id}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0
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
        tmpl = _.template( $('script.add-report').html() );
        $('.find-report').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        fillSelector($('#research-type-selector'), App.store.selectData.ResearchType);
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
        fillResearchInputs();
        fillSelector($('#research-type-selector'), App.store.selectData.ResearchType);
      } else {
        $("#research-input-id").val(ui.item.resId);
        $("#report-input-id").val(ui.item.id);
        repSelName = ui.item.name;

        let query = JSON.stringify({
          "res:Research": {"id": ui.item.resId+"", "select": "*"},
          "exc:Excavation": {"id": "*", "select": "*"},
          "res__has__exc": {}
        });

        $.post('/hquery/read', query)
        .success(function(excs) {
          excs = JSON.parse(excs);

          $('#exc-input').autocomplete({
            source: _.map(excs.exc, function(r, key) {
              return {'label': `${r.name} (Руководитель - ${r.boss})`, 'id': r.id}
            }),
            minLength: 0
          }).focus(function() {
            $(this).autocomplete("search");
          });
        });
      }
    });


    $('#exc-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#exc-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $('#exc-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-exc').html() );
        $('.find-exc').replaceWith( tmpl() );

        coordpicker($('#exc-coord-picker'), {
          inputs: ['#exc-x', '#exc-y'],
          map: 'map'
        });

        $('#' + addName(id)).val(inputValue);
        // setSelectsEvents();
        // fillResearchInputs();
        // fillSelector($('#research-type-selector'), App.store.selectData.ResearchType);
      } else {
        $("#exc-input-id").val(ui.item.id);
        // repSelName = ui.item.name;
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


    $('#heritage-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });
    
    $('#heritage-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-heritage').html() );

        $('.find-heritage').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $('#heritage-input-id').val(ui.item.id);
      }
    });


    // События для прослушивания размера файлов
    var checkFileSize = App.fn.checkFileSize;
    var $authorPhoto = $('#author-photo-input');
    $authorPhoto.change(checkFileSize.bind($authorPhoto, 10));

    var $heritage = $('#heritage-files-input');
    $heritage.change(checkFileSize.bind($heritage, 50));

    var $reportDoc = $('#report-file-input');
    $reportDoc.change(checkFileSize.bind($reportDoc, 50));

    // События для выбора года из диапазона от 0 до текущего года
    var checkYear = App.fn.checkYear;
    var $authorYear = $('#author-birth-date-input');
    $authorYear.bind('keyup mouseup', checkYear.bind($authorYear));

    var $repYear = $('#report-year-input');
    $repYear.bind('keyup mouseup', checkYear.bind($repYear));

    // Валидация полей с автокомплитом
    // var validate = App.fn.validInput;
    // validate('author-input', lastSelectedAuthorName);
    // validate('report-input', repSelName);
    // validate('report-city-input', lastSelectedCityName);
    // validate('report-organization-input', orgName);
    // validate('heritage-input', heritageSelName);


    function fillResearchInputs() {
      var name = $("#report-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
    };

    $('#send-button').on('click', function() {
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery('m');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#mon-type-selector"), "MonumentType");
    getDataForSelector($("#research-type-selector"), "ResearchType");
    setSelectsEvents();

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

      $('#culture-input').autocomplete({
        source: function(req, res) {
          let term = req.term.toLowerCase();
          
          res(grepObject(term, items, 'label'));
        },
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    });

    $('#culture-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#culture-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'value': 'Ничего не найдено. Добавить?',
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });
    
    $('#culture-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-culture').html() );

        $input.parent().replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $('#culture-input-id').val(ui.item.id);
      }
    });


    // let excId = 1;
    // $('#add-exc-button').on('click', function(e) {
    //   let localExcId = excId;
    //   let params = {
    //     excId: localExcId
    //   }

    //   App.template.get("", function(tmpl) {
    //     $('#add-exc-button').before(tmpl(params));
    //   })
    //   excId++;
    // });

    let photoId = 1;
    $('#add-photo-button').on('click', function(e) {
      let localPhotoId = photoId;
      let params = {
        photoId: localPhotoId
      }

      App.template.get("monument/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));

        getDataForSelector($(`#photo-view-selector-${localPhotoId}`), "CardinalDirection");
        App.views.functions.setAccordionHeader($(`#photo-header-${localPhotoId}`));
      })
      photoId++;
    });

    let topoId = 1;
    $('#add-topo-button').on('click', function(e) {
      let localTopoId = topoId;
      let params = {
        topoId: localTopoId
      }

      App.template.get("monument/addTopoplan", function(tmpl) {
        $('#add-topo-button').before(tmpl(params));

        App.views.functions.setAccordionHeader($(`#topo-header-${localTopoId}`));
      })
      topoId++;
    });


    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: 'map'
    });
    
    $("#container").tabs();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },

  "show": function(argument) {
    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");
  },

  "new_by_xlsx": function() {
    
  },

  "new_by_arch_map": function(context) {
    console.log(context);
  },

  'create': function() {
    alert(22)
  }
}));
