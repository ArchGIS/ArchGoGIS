'use strict';

App.views.search = new (Backbone.View.extend({
  'index': function() {
    var t = App.locale.translate;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let map = App.views.map().map;
    let markersLayer = new L.FeatureGroup();

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
          'epoch': $('#monument-epoch'),
          'type': $('#monument-type')
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
      },
      'okn-params': {
        'handler': searchOkn,
        'columnsMaker': function(okns) {
          return _.map(okns, function(r) {
            return App.models.Heritage.href(r.id, `${r.name ? r.name : 'Нет названия'}`);
          });
        },
        'inputs': {
          'okn': $('#heritage-input')
        }
      },
      'excavation-params': {
        'handler': searchExcavation,
        'columnsMaker': function(reports) {
          return _.map(reports, function(r) {
            return [App.models.Excavation.href(r[0], `${r[1]} (${r[3]} - ${r[2]})`)];
          });
        },
        'inputs': {
          'author': $('#exc-author-input'),
          'year': $('#exc-year-input')
        }
      }
    };

    $('#show-results-button').on('click', showResults);

    // Заполнение и отрисовка результатов.
    function showResults() {
      $results.empty();
      object.handler(object);
    }

    // Заполнение селекторов
    let $epoch = $('#monument-epoch');
    let $culture = $('#monument-culture');
    let $monType = $('#monument-type');
    getDataForSelector($epoch, 'Epoch');
    $epoch.prepend('<option value="0" selected>Ничего не выбрано</option>');
    getDataForSelector($monType, 'MonumentType');
    $monType.prepend('<option value="0" selected>Ничего не выбрано</option>');
    getDataForSelector($culture, 'Culture');
    $culture.prepend('<option value="0" selected>Ничего не выбрано</option>');

    // Смена искомого объекта.
    $objectToggler.setCallback(function($object) {
      $results.empty();
      markersLayer.clearLayers();
      object = objects[$object.prop('id')];
    });
    object = objects['monument-params'];

    // Поиск памятника
    function searchMonument(my) {
      var input = my.inputs;

      var mnt   = input.monument.val(),
          epoch = input.epoch,
          type  = input.type;


      if (mnt || epoch) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_monuments', {
              'name': mnt,
              'epoch': epoch.val() != 0 ? epoch.val() : '',
              'type': type.val() != 0 ? type.val() : ''
            });

            $.get({
              url: url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                resolve($.parseJSON(response));
              },
              error: reject
            });
          });
        }

        find()
          .then(function(response) {
            if (response.length) {
              console.log(response);
              var list = my.columnsMaker(response);

              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                let type = item[0].monTypeId || 10;
                let epoch = item[0].ep || 0;

                let icon = L.icon({
                  iconUrl: `/web_client/img/monTypes/monType${type}_${epoch}.png`,
                  iconSize: [16, 16]
                });

                let marker = L.marker(new L.LatLng(item[0].x, item[0].y), {
                  icon: icon
                });

                marker.bindTooltip(item[0].monName, {
                  direction: 'top'
                });

                marker.on('mouseover', function(e) {
                  this.openTooltip();
                });
                marker.on('mouseout', function(e) {
                  this.closeTooltip();
                });
                marker.on('click', function(e) {
                  location.hash = `monument/show/${item[0].monId}`
                });

                markersLayer.addLayer(marker);
              });

              map.addLayer(markersLayer);
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

            $.get({
              url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                resolve($.parseJSON(response));
              },
              error: reject
            });
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

            $.get({
              url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                resolve($.parseJSON(response));
              },
              error: reject
            });
          });
        }

        find()
          .then(function(response) {
            if (response.length) {
              var list = my.columnsMaker(response);

              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                let type = item[0].resTypeId || 1;

                for (var i=0; i < item[0].x.length; i++) {
                  let icon = L.icon({
                    iconUrl: `/web_client/img/resTypes/resType${type}.png`,
                    iconSize: [16, 16]
                  });

                  let marker = L.marker(new L.LatLng(item[0].x[i], item[0].y[i]), {
                    icon: icon
                  });

                  marker.bindTooltip(item[0].resName, {
                    direction: 'top'
                  });

                  marker.on('mouseover', function(e) {
                    this.openTooltip();
                  });
                  marker.on('mouseout', function(e) {
                    this.closeTooltip();
                  });
                  marker.on('click', function(e) {
                    location.hash = `research/show/${item[0].resId}`
                  });

                  markersLayer.addLayer(marker);
                }
              });

              map.addLayer(markersLayer);
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

            $.get({
              url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                resolve($.parseJSON(response));
              },
              error: reject
            });
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

    // Поиск ОКН
    function searchOkn(my) {
      var input = my.inputs;

      var okn = input.okn.val();

      if (true) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/okns', {
              'needle': okn || "[а-я]"
            });

            $.get({
              url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                resolve($.parseJSON(response));
              },
              error: reject
            });
          });
        }

        find()
          .then(function(response) {
            if (response.length) {
              var list = my.columnsMaker(response);
              
              _.each(list, function(item) {
                $results.append(`<p>${item}</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                let icon = L.icon({
                  iconUrl: `/web_client/img/heritage/heritage.png`,
                  iconSize: [16, 16]
                });

                let marker = L.marker(new L.LatLng(item.x, item.y), {
                  icon: icon
                });

                marker.bindTooltip(item.name, {
                  direction: 'top'
                });

                marker.on('mouseover', function(e) {
                  this.openTooltip();
                });
                marker.on('mouseout', function(e) {
                  this.closeTooltip();
                });
                marker.on('click', function(e) {
                  location.hash = `heritage/show/${item.id}`
                });

                markersLayer.addLayer(marker);
              });

              map.addLayer(markersLayer);
            } else {
              $results.append('<p>Ничего не найдено. Попробуйте другие варианты.</p>')
            }
          }, function(error) {
            console.log(error);
          });
      }
    }

    function searchExcavation(my) {
      var input = my.inputs;

      var author = input.author.val(),
          year   = input.year.val();


      if (author || year) {
        function find() {
          return new Promise(function(resolve, reject) {
            var url = App.url.make('/search/filter_excavations', {
              'author': author,
              'year': year
            });

            $.get({
              url,
              beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
              },
              success: (response) => {
                console.log(response)
                resolve($.parseJSON(response));
              },
              error: reject
            });
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
