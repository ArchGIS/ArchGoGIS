'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    
    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
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
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var lastSelectedAuthorId = 0;
    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

    var lastSelectedCityId = 0;
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        citySelectHandler(event, ui);
      } 
    });

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

      if ( validateCreatePages() ) {
        postQuery();
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    fillSelector($("#epoch-selector"), "Epoch");
    fillSelector($("#culture-selector"), "Culture");
    fillSelector($("#mon-type-selector"), "MonumentType");
    fillSelector($("#research-type-selector"), "ResearchType");
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
    App.views.functions.setAccordion("accordion");
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
