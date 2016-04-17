'use strict';

App.views.monument = new (App.View.extend({
  "new_by_arch_map": function(models) {
    
  },
  
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
  
    var lastSelectedAuthorId = 0;
    App.page.get('author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

    setSelectsEvents();
    $("#container").tabs();
  },

  'create': function() {
    alert(22)
  }
}));
