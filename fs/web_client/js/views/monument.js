'use strict';

App.views.monument = new (App.View.extend({
  'new': function() {
    var fmt = App.fn.fmt;
    
    var authorSelectHandler = function(event, ui) {
      console.log(ui.item.id);
      $('#author-input-id').val(ui.item.id);

      App.models.Research.findByAuthorId(ui.item.id).then(function(researches) {
        $('#research-input').autocomplete({
          source: _.map(researches, function(research) {
            return {'label': fmt('$description ($year)', research), 'id': research.id}
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
    App.page.get('author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      } 
    });

    $("#coauthor-input").bind("keyup", function(event) {
      if (event.keyCode === $.ui.keyCode.BACKSPACE) {
        var coauthors = _.values(App.store.coauthors);
        var input = this.value.split(', ');

        if (coauthors.length == input.length) {
          this.value = coauthors.join(", ") + ", ";
        } else {
          var inter = _.intersection(coauthors, input);
          this.value = (inter.length) ? inter.join(", ") + ", " : "";

          App.store.coauthors = _.pick(App.store.coauthors, value => _.contains(inter, value));
        }
        $("#coauthor-input-id").val(_.keys(App.store.coauthors));
      }
    });

    App.page.get('coauthor-input').on('autocompleteselect', function(event, ui) {
      App.store.coauthors[ui.item.id] = ui.item.value;
      this.value = _.values(App.store.coauthors).join(", ")+", ";
      $("#coauthor-input-id").val(_.keys(App.store.coauthors));
      return false;
    });

    App.page.get('coauthor-input').on('autocompletefocus', function(event, ui) {
      return false;
    })

    setSelectsEvents();
    $("#container").tabs();
  }
}));
