'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    var t = App.locale.translate;
    var excludeIdent = App.fn.excludeIdentMonuments;

    var $results = $('#search-results');

    var $objectToggler = App.page.get('objectToggler');
    var object = null;
    var objects = {
      'monument-params': {
        'handler': searchMonument,
        'columnsMaker': function(monuments) {
          return _.map(excludeIdent(monuments), function(mk) {
            return [App.models.Monument.href(mk.monId, `${mk.monName} (${mk.epName}, ${mk.monType})`)];
          });
        },
        'inputs': {
          'monument': $('#monument-input'),
          'epoch': $('#monument-epoch')
        }
      },
      'research-params': {
        'handler': searchResearch,
        'columnsMaker': function(researches) {
          return _.map(researches, function(r) {
            return [App.models.Research.href(r[0].resId, `${r[0].resName ? r[0].resName : ''}`)];
          });
        },
        'inputs': {
          'author': $('#research-author-input'),
          'year': $('#research-year-input')
        }
      },
      'author-params': {
        'handler': searchAuthor,
        'columnsMaker': function(authors) {
          return _.map(authors, function(a) {
            return [App.models.Author.href(a[0], `${a[1]} ${a[2] ? a[2] : ''}`)];
          });
        },
        'inputs': {
          'author': $('#author-input')
        }
      },
      'report-params': {
        'handler': searchReport,
        'columnsMaker': function(reports) {
          return _.map(reports, function(r) {
            return [App.models.Report.href(r[0], `${r[1] ? r[1] : ''} (${r[3]} - ${r[2]})`)];
          });
        },
        'inputs': {
          'author': $('#report-author-input'),
          'year': $('#report-year-input')
        }
      }
    };

    $('#show-results-button').on('click', showResults);

    // Заполнение и отрисовка результатов.
    function showResults() {
      $results.empty();
      object.handler(object);
    }

    // Заполнение селекта эпох
    // Выключение выбора эпохи и культуры по умолчанию
    var $epoch = $('#monument-epoch');
    var $culture = $('#monument-culture');
    getDataForSelector($epoch, 'Epoch');
    $epoch.prepend('<option value="0" selected>Ничего не выбрано</option>');
    getDataForSelector($culture, 'Culture');
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

      var mnt   = input.monument.val(),
          epoch = input.epoch;


      if (mnt || epoch) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_monuments', {
              'name': mnt,
              'epoch': epoch.val() != 0 ? epoch.val() : ''
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
              console.log(response);
              var list = my.columnsMaker(response);
              var map = App.page.get("map");
              map.removeAll();

              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              var counter = 1;
              _.each(response, function(item) {
                var type = item[0].monTypeId || 10;
                var epoch = item[0].ep || 0;

                map.addPlacemark(
                  [item[0].x, item[0].y],
                  {hintContent: item[0].monName},
                  {preset: `monType${type}_${epoch}`}
                );
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

      var author = input.author.val();

      if (author || year) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_authors', {
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
                var type = item[0].resTypeId || 1;
                for (var i=0; i < item[0].x.length; i++) {
                  map.addPlacemark(
                    [item[0].x[i], item[0].y[i]],
                    {hintContent: item[0].resName},
                    {preset: `resType${type}`}
                  );
                }
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
