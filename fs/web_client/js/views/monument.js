'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    var authorSelectHandler = function(event, ui) {
      console.log(ui.item.id);
      $('#author-input-id').val(ui.item.id);

      var researches = [];

      App.models.Research.findByAuthorId(ui.item.id).then(function(data) {
        var title;
        $.each(data, function(key, res) {
          title = res.description+' ('+res.year+')';
          researches.push({label: title, id: res.id})
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
            console.log(data)
            var data = $.parseJSON(data).knowledge;
            var title;
            $.each(data, function(key, res) {
              title = res.name+" ("+res.culture+")";
              monuments.push({label: title, id: res.id})
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
