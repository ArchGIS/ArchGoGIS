'use strict';

App.views.artifact = new (App.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;
    
    var fmt = App.fn.fmt;

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Research.findByAuthorId(ui.item.id).then(function(researches) {
        console.log(researches)
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
        }
      }).focus(function(){            
        $(this).autocomplete("search");
      });

      $("#monument-input").autocomplete({
        source: function(request, response) {
          var monuments = [];

          App.models.Monument.findByNamePrefix(request.term)
            .then(function(data) {
              console.log(data);
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

    $('#send-button').on('click', function() {
      if ( validateCreatePages() ) {
        postQuery();
      } else {
        alert('Недостаточно данных. Заполните все подсвеченные красным поля!');
      }
    });

    fillSelector($("#epoch-selector"), "Epoch");
    fillSelector($("#culture-selector"), "Culture");
    fillSelector($("#research-type-selector"), "ResearchType");
    setSelectsEvents();

    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: 'map'
    });

    $("#container").tabs();
  }
}));
