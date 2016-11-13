'use strict';

App.views.monument = new (Backbone.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    
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
        minLength: 0,
        select: function(event, ui) {
          var resId = ui.item.resId;

          $("#research-input-id").val(resId);
          $("#report-input-id").val(ui.item.id);
          repSelName = ui.item.name;
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

    var lastSelectedAuthorId = 0;
    var lastSelectedAuthorName = '';
    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
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

    $("#heritage-input").autocomplete({
      source: function(request, response) {
        var heritages = [];

        App.models.Heritage.findByNamePrefix(request.term)
          .then(function(data) {
            if (data && !data.error) {
              response(_.map(data, function(row) {
                return {'label': `${row[1]} (${row[3]}, ${row[2]})`, 'id': row[0]}
              }))
            } else {
              response();
            }
          });
      },
      minLength: 3,
      select: function(event, ui) {
        $("#heritage-input-id").val(ui.item.id);
        heritageSelName = ui.item.name;
      }
    }).focus(function(){
      $(this).autocomplete("search");
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
    var validate = App.fn.validInput;
    validate('author-input', lastSelectedAuthorName);
    validate('report-input', repSelName);
    validate('report-city-input', lastSelectedCityName);
    validate('report-organization-input', orgName);
    validate('heritage-input', heritageSelName);


    var fillResearchInputs = function() {
      if ($("#new-report-checkbox").is(":checked") == true) {
        var year = $("#report-year-input").val();
        var name = $("#report-name-input").val() + " - " + year;
        $("#research-input-name").val(name);
        $("#research-input-year").val(year);
      }
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
    getDataForSelector($("#culture-selector"), "Culture");
    getDataForSelector($("#mon-type-selector"), "MonumentType");
    getDataForSelector($("#research-type-selector"), "ResearchType");
    setSelectsEvents();
    
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
