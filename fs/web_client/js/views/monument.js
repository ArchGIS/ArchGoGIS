'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    App.page.get('authorInput').on('autocompleteselect', function(event, ui) {
      console.log(ui.item.id);
      $('#author-input-id').val(ui.item.id);

      var args = {
        'r:Research': {'id': '*', 'select': '*'},
        'a:Author': {'id': $('#author-input-id').val()},
        'a_Created_r': {}
      }
      var researches = [];

      $.post('/hquery/read', JSON.stringify(args), function(data) {
        var data = $.parseJSON(data).r;
        var title;
        $.each(data, function(key, res) {
          title = res.description+' ('+res.year+')';
          researches.push({label: title, id: res.id})
        });
        $('#research-input').autocomplete({
          source: researches
        })
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

    setSelectsEvents();
    setSwitches();
    $("#container").tabs();
  }
}));
