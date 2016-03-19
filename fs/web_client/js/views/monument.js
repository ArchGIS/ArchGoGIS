'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    var fmt = App.fn.fmt;
    
    var authorSelectHandler = function(event, ui) {
      console.log(ui.item.id);
      $('#author-input-id').val(ui.item.id);

      var researches = [];

      App.models.Research.findByAuthorId(ui.item.id).then(function(data) {
        _.each(data, function(res) {
          researches.push({label: fmt("$description ($year)", res), id: res.id})
        });
        $('#research-input').autocomplete({
          source: researches
        });
      });
      
      $("#research-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) { 
          $("#research-input-id").val(ui.item.id);
          
          var args = {
            "monument:Monument": {"id": "*", "select": "*"},
            "researches:Research": {"id": $("#research-input-id").val()},
            "knowledge:Knowledge": {"id": "*", "select": "*"},
            "researches_Contains_knowledge": {},
            "knowledge_Describes_monument": {}
          }
          var monuments = [];

          $.post(dburl+"hquery/read", JSON.stringify(args), function(data) {
            var data = $.parseJSON(data).knowledge;
            _.each(data, function(res) {
              monuments.push({label: fmt("$name ($culture)", res), id: res.id})
            });
            $("#monument-input").autocomplete({
              source: monuments
            })
          })
        }
      }).focus(function(){            
        $(this).autocomplete("search");
      });

      $("#monument-input").autocomplete({
        source: function(request, response) {
          response(window[""+$("#research-input-id").val()]);
        },
        minLength: 0,
        select: function(event, ui) { 
          $("#monument-input-id").val(ui.item.id);
        }
      }).focus(function(){            
        $(this).autocomplete("search");
      });
    };
  
    var lastSelectedAuthorId = 0;
    App.page.get('authorInput').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

    setSelectsEvents();
    setSwitches();
    $("#container").tabs();
  }
}));
