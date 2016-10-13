'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    var t = App.locale.translate;
    var grepObject = App.fn.grepObject;
    
    var $results = $('#search-results');
    // var $resultsCount = $('#results-count');

    var resultProvider = null;
    var $objectToggler = App.page.get('objectToggler');
    var object = null;
    var objects = {
      'monument-params': {
        'handler': searchMonument,
        'heading': ['#', t('monument.prop.type'), t('monument.prop.epoch')],
        'columnsMaker': function(monuments) {
          return _.map(monuments, function(mk) {
            return [App.models.Monument.href(mk[0], `${mk[1]} (${mk[3]} - ${mk[2]})`)];
              // t('monument.types')[+mk[2]],
              // t('epoch')[mk[3] - 1]
          });
        },
        'inputs': {
          'monument': $('#monument-input'),
          'year': $('#monument-year'),
          'author': $('#monument-author'),
          'epoch': $('#monument-epoch'),
          'culture': $('#monument-culture')
        }
      },
      'research-params': {
        'handler': searchResearch,
        'heading': ['#', t('research.prop.description'), t('research.prop.type')],
        'columnsMaker': function(researches) {
          return _.map(researches, function(r, n) {
            return [App.models.Research.href(r.id, n+1), r.description, r.type];
          });
        },
        'inputs': {
          'author': App.page.get('research-author-input'),
          '$year': $('#research-year-input') 
        }
      },
      'author-params': {
        'handler': searchAuthor,
        'heading': ['#', t('author.prop.name'), t('author.prop.year')],
        'columnsMaker': function(authors) {
          return _.map(authors, function(a, n) {
            return [App.models.Author.href(a.id, n+1), a.name, a.year];
          });
        },
        'inputs': {'author': App.page.get('author-input')}
      },
      'report-params': {
        'handler': searchReport,
        'heading': ['#', t('report.prop.description'), t('report.prop.type')],
        'columnsMaker': function(reports) {
          return _.map(reports, function(r, n) {
            return [App.models.Report.href(r.id, n+1), r.description, r.type];
          });
        },
        'inputs': {
          'author': App.page.get('report-author-input'),
          '$year': $('#report-year-input') 
        }
      }
    };

    $('#show-results-button').on('click', showResults);
    
    // Заполнение и отрисовка таблицы результатов.
    function showResults() {
      $results.empty();
      object.handler(object);
    }

    // Заполнение селекта эпох
    // Выключение выбора эпохи и культуры по умолчанию
    var $epoch = $('#monument-epoch');
    var $culture = $('#monument-culture');
    fillSelector($epoch, 'Epoch');
    $epoch.prepend('<option value="0" selected>Ничего не выбрано</option>');
    fillSelector($culture, 'Culture');
    $culture.prepend('<option value="0" selected>Ничего не выбрано</option>');

    // Смена искомого объекта.
    $objectToggler.setCallback(function($object) {
      $results.empty();
      object = objects[$object.prop('id')];
      // object.handler(object);
    });
    object = objects['monument-params'];
    // object.handler(object);

    // Поиск памятника
    function searchMonument(my) {
      var input = my.inputs;

      var mnt     = input.monument.val(),
          year    = input.year.val(),
          author  = input.author.val(),
          epoch   = input.epoch,
          culture = input.culture;

      // input.monument.val('');
      // input.year.val('');
      // input.epoch.val('0');
      // input.culture.val('0');

      if (mnt || year || author || epoch.val() != 0 || culture.val() != 0) {
        // var find = App.models.Monument.findByNamePrefix(mnt);
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_monuments', {
              'name': mnt,
              'year': year,
              'author': author,
              'epoch': epoch.val() != 0 ? epoch.val() : '',
              'culture': culture.val() != 0 ? culture.val() : ''
              // 'limit': 10
            });

            $.get(url)
              .success((response) => {
                resolve($.parseJSON(response));
              })
              .error(reject);
          });
        }

        find()
          .then(function(response) {
            // input.css('border', '');
            if (response.length) {
              var list = my.columnsMaker(response);

              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });
            } else {
              $results.append('<p>Ничего не найдено. Попробуйте другие варианты.</p>')
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        // input.monument.css('border', 'solid 1px #f33');
        $results.append('<p class="danger">Заполните одно поле или несколько</p>')
      }
    }

    // Поиск автора
    function searchAuthor(my) {
      var authors = [];
      resultProvider = () => authors;

      my.inputs.author.on('autocompleteselect', function(event, ui) {
        $results.show();
        authors = grepObject('^' + ui.item.label, my.inputs.author.getRecords(), 'name');
        $resultsCount.html(authors.length);     
      });
    }

    // Поиск исследования
    function searchResearch(my) {
      var researches = [];
      var filteredResearches = [];
      resultProvider = () => filteredResearches;
     
      function handleAuthorSelect(event, ui) {
        App.models.Research.findByAuthorId(ui.item.id).then(function(researches) {
          
          my.inputs.$year.autocomplete({
            'minLength': 0,
            'source': _.map(_.uniq(researches, 'year'), function(research) {
              return {'label': research.year, 'id': research.id}
            })
          })
          .on('focus', () => my.inputs.$year.autocomplete('search'))
          .on('autocompleteselect', function(event, ui) {
            $results.show();
            filteredResearches = _.filter(researches, r => r.year == ui.item.label);
            $resultsCount.html(filteredResearches.length);
          });
        });
      }
      
      my.inputs.author.on('autocompleteselect', handleAuthorSelect);
    }

    function searchReport(my) {
      var reports = [];
      var filteredReport = [];
      resultProvider = () => filteredReport;
     
      function handleAuthorSelect(event, ui) {
        App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
          
          my.inputs.$year.autocomplete({
            'minLength': 0,
            'source': _.map(_.uniq(reports, 'year'), function(report) {
              return {'label': report.year, 'id': report.id}
            })
          })
          .on('focus', () => my.inputs.$year.autocomplete('search'))
          .on('autocompleteselect', function(event, ui) {
            $results.show();
            filteredReport = _.filter(reports, r => r.year == ui.item.label);
            $resultsCount.html(filteredReport.length);
          });
        });
      }
      
      my.inputs.author.on('autocompleteselect', handleAuthorSelect);
    }
  }
}));
