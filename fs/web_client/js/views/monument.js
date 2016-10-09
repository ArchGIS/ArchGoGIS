'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    function bindCoords() {
      var $x = $('#monument-x');
      var $y = $('#monument-y');
      var map = App.page.get('map');
      var $button = $('#pick-coord');
      
      function updateInputValues(coords) {
        $x.val(coords[0]);
        $y.val(coords[1]);
      }

      function updatePlacemark() {
        updateInputValues(map.getCenter());
        map.updatePlacemark('coord-pick', map.getCenter(), {'draggable': true});
      }
      
      function createPlacemark() {
        updatePlacemark();
        
        map.onPlacemark('coord-pick', 'dragend', function(event) {
          updateInputValues(event.get('target').geometry.getCoordinates());
        });

        // Следующие клики ставят отметку в отображаемый центр карты.
        $button.on('click', updatePlacemark);
      }
      
      $button.one('click', createPlacemark);
    }

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
    bindCoords();
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
