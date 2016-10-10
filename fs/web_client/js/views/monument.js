'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {    
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
      var title = $("#report-title-input").val() + " - " + year;
      $("#research-name-input").val(title);
      $("#research-year-input").val(year);
      console.log(year)
      console.log(title)
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
    });
    setSelectsEvents();
    $("#container").tabs();
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
