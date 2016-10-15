'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    var t = App.locale.translate;
    var grepObject = App.fn.grepObject;
    
    var $results = $('#search-results');

    var $objectToggler = App.page.get('objectToggler');
    var object = null;
    var objects = {
      'monument-params': {
        'handler': searchMonument,
        'heading': ['#', t('monument.prop.type'), t('monument.prop.epoch')],
        'columnsMaker': function(monuments) {
          return _.map(monuments, function(mk) {
            return [App.models.Monument.href(mk[0], `${mk[1]} (${mk[3]} - ${mk[2]})`)];
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
          return _.map(researches, function(r) {
            return [App.models.Research.href(r[0], `${r[1]} (${r[3]} - ${r[2]})`)];
          });
        },
        'inputs': {
          'author': $('#research-author-input'),
          'year': $('#research-year-input') 
        }
      },
      'author-params': {
        'handler': searchAuthor,
        'heading': ['#', t('author.prop.name'), t('author.prop.year')],
        'columnsMaker': function(authors) {
          return _.map(authors, function(a) {
            return [App.models.Author.href(a[0], `${a[1]} ${a[2]}`)];
          });
        },
        'inputs': {
          'author': $('#author-input'),
          'year': $('#author-year')
        }
      },
      'report-params': {
        'handler': searchReport,
        'heading': ['#', t('report.prop.description'), t('report.prop.type')],
        'columnsMaker': function(reports) {
          return _.map(reports, function(r) {
            return [App.models.Report.href(r[0], `${r[1]} (${r[3]} - ${r[2]})`)];
          });
        },
        'inputs': {
          'author': $('#report-author-input'),
          'year': $('#report-year-input') 
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
      App.page.get("map").removeAll();
      object = objects[$object.prop('id')];
    });
    object = objects['monument-params'];


    // Поиск памятника
    function searchMonument(my) {
      var input = my.inputs;

      var mnt     = input.monument.val(),
          year    = input.year.val(),
          author  = input.author.val(),
          epoch   = input.epoch,
          culture = input.culture;


      if (mnt || year || author || epoch.val() != 0 || culture.val() != 0) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_monuments', {
              'name': mnt,
              'year': year,
              'author': author,
              'epoch': epoch.val() != 0 ? epoch.val() : '',
              'culture': culture.val() != 0 ? culture.val() : ''
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
            if (response.length) {
              var list = my.columnsMaker(response);
              var map = App.page.get("map");
              map.removeAll();

              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              var counter = 1;
              _.each(response, function(item) {
                map.addPlacemark([item[6], item[7]], {
                  hintContent: item[1],
                  iconContent: counter++
                });
              })
            } else {
              $results.append('<p>Ничего не найдено. Попробуйте другие варианты.</p>')
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append('<p class="danger">Заполните одно поле или несколько</p>')
      }
    }

    // Поиск автора
    function searchAuthor(my) {
      var input = my.inputs;

      var author = input.author.val(),
          year   = input.year.val();


      if (author || year) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_authors', {
              'author': author,
              'year': year
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
        $results.append('<p class="danger">Заполните одно поле или несколько</p>')
      }
    }

    // Поиск исследования
    function searchResearch(my) {
      var input = my.inputs;

      var year   = input.year.val(),
          author = input.author.val();


      if (year || author) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_res', {
              'year': year,
              'author': author
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
            if (response.length) {
              var list = my.columnsMaker(response);
              var map = App.page.get("map");
              map.removeAll();
              
              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              var counter = 1;
              _.each(response, function(item) {
                map.addPlacemark([item[4], item[5]], {
                  hintContent: item[1],
                  iconContent: counter++
                });
              })
            } else {
              $results.append('<p>Ничего не найдено. Попробуйте другие варианты.</p>')
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append('<p class="danger">Заполните одно поле или несколько</p>')
      }
    }

    function searchReport(my) {
      var input = my.inputs;

      var author = input.author.val(),
          year   = input.year.val();


      if (author || year) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_reports', {
              'author': author,
              'year': year
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
        $results.append('<p class="danger">Заполните одно поле или несколько</p>')
      }
    }
  }
}));
