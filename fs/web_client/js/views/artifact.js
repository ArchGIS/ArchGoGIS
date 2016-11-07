'use strict';

App.views.artifact = new (App.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;

    var fmt = App.fn.fmt;

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Research.findByAuthorId(ui.item.id).then(function(researches) {
        $('#research-input').autocomplete({
          source: _.map(researches, function(research) {
            return {'label': fmt('$name ($year)', research), 'id': research.id}
          })
        });
      });

      $("#research-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#research-input-id").val(ui.item.id);
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

    $("#monument-input").autocomplete({
      source: function(request, response) {
        var monuments = [];

        App.models.Monument.findByNamePrefix(request.term)
          .then(function(data) {
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

    var lastSelectedAuthorId = 0;
    var lastSelectedAuthorName = '';
    App.page.get('author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
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


    // События для прослушивания размера файлов
    var checkFileSize = App.fn.checkFileSize;
    var $authorPhoto = $('#author-photo-input');
    $authorPhoto.change(checkFileSize.bind($authorPhoto, 10));

    var $artifactPhoto = $('#artifact-photo-input');
    $artifactPhoto.change(checkFileSize.bind($artifactPhoto, 10));

    var $reportDoc = $('#report-file-input');
    $reportDoc.change(checkFileSize.bind($reportDoc, 50));

    // События для выбора года из диапазона от 0 до текущего года
    var checkYear = App.fn.checkYear;
    var $authorYear = $('#author-birth-date-input');
    $authorYear.bind('keyup mouseup', checkYear.bind($authorYear));

    var $resYear = $('#research-year-input');
    $resYear.bind('keyup mouseup', checkYear.bind($resYear));

    var $repYear = $('#report-year-input');
    $repYear.bind('keyup mouseup', checkYear.bind($repYear));

    var $artYear = $('#artifact-year-input');
    $artYear.bind('keyup mouseup', checkYear.bind($artYear));


    var $authorInput = $('#author-input');
    var tip = new Opentip($authorInput, {
      showOn: null,
      style: 'alert',
      target: true,
      tipJoint: "bottom"
    });

    $authorInput.on('focus', () => {
      tip.hide();
    });

    $authorInput.on('change', () => {
      var hiddenId = $('#author-input-id').val();
      if ( hiddenId && lastSelectedAuthorName === $authorInput.val() ) {
        tip.hide();
      } else {
        tip.setContent(`Такого автора не существует.
          Введите часть имени автора и выберите из выпадающего списка подходящий вариант.
          Если такой вариант не нашёлся, то добавьте нового.`);
        tip.show();
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

    $("#container").tabs();

    $('#send-button').on('click', function() {
      if ( validateCreatePages() ) {
        postQuery();
      } else {
        alert('Недостаточно данных. Заполните все подсвеченные красным поля!');
      }
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#culture-selector"), "Culture");
    getDataForSelector($("#research-type-selector"), "ResearchType");
    getDataForSelector($("#mon-type-selector"), "MonumentType");
    setSelectsEvents();

    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: 'map'
    });

  }
}));
