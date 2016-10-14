'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;

    var fmt = App.fn.fmt;
    
    var authorSelectHandler = function(event, ui) {
      console.log(ui.item.id);
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports, function(report) {
            return {'label': fmt('$description ($year)', report), 'id': report.id}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) { 
          $("#report-input-id").val(ui.item.id);
        }
      }).focus(function(){            
        $(this).autocomplete("search");
      });
    };
    
    var fillResearchInputs = function(){
      var year = $("#report-year-input").val();
      var name = $("#report-name-input").val() + " - " + year;
      $("#research-name-input").val(name);
      $("#research-year-input").val(year);
    };

    var lastSelectedAuthorId = 0;
    App.page.get('author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

    $('#send-button').on('click', function() {
      fillResearchInputs();
      postQuery();
      // uploadFile('#report-file-input');
    });

    fillSelector($("#epoch-selector"), "Epoch");
    fillSelector($("#culture-selector"), "Culture");
    setSelectsEvents();
    
    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: 'map'
    });

    $("#container").tabs();
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
