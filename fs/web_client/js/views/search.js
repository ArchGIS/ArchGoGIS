'use strict';

App.views.search = new (Backbone.View.extend({
  'index': function() {
    const t = App.locale.translate;
    const ctl = App.locale.cyrToLatin;
    const excludeIdent = App.fn.excludeIdentMonuments;
    const map = App.views.map().map;
    const markersLayer = new L.FeatureGroup();

    const $results = $('#search-results');

    const $objectToggler = App.page.get('objectToggler');
    let object = null;
    let objects = {
      'monument-params': {
        'handler': searchMonument,
        'columnsMaker': function(monuments) {
          return _.map(excludeIdent(monuments), function(mk) {
            return App.models.Monument.href(mk.monId, `${mk.monName} (${mk.epName}, ${mk.monType})`);
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
            return App.models.Research.href(r.resId, `${r.autName}, ${r.resTypeName} (${r.resYear})`);
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
            return App.models.Author.href(a.id, `${a.name} ${a.birth ? a.birth : ''}`);
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
            return App.models.Report.href(r.id, `${r.name ? r.name : ''} (${r.author} - ${r.year})`);
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
            return App.models.Excavation.href(r.id, `${r.name} (${r.author} - ${r.resYear})`);
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

      if (mnt || epoch || type) {
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
        };

        find()
          .then(function(response) {
            if (response.length) {
              console.log(response);
              let list = my.columnsMaker(response);
              let coords = [];

              _.each(response, function(item, i) {
                coords[i] = App.models.Monument.getActualSpatref(item.monId);
              });

              _.each(list, function(item, i) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item, i) {
                $.when(coords[i]).then(function(coord) {
                  if ((coord.x != "нет данных" && coord.y != "нет данных") || (item.x && item.y)) {
                    let type = item.monTypeId || 10;
                    let epoch = item.ep || 0;
                    coord.x = item.x || coord.x;
                    coord.y = item.y || coord.y;

                    let icon = L.icon({
                      iconUrl: `/web_client/img/monTypes/monType${type}_${epoch}.png`,
                      iconSize: [16, 16]
                    });

                    let marker = L.marker(new L.LatLng(coord.x, coord.y), {
                      icon: icon
                    });

                    marker.bindTooltip(item.monName, {
                      direction: 'top'
                    });

                    marker.on('mouseover', function(e) {
                      this.openTooltip();
                    });
                    marker.on('mouseout', function(e) {
                      this.closeTooltip();
                    });
                    marker.on('click', function(e) {
                      window.open(`${HOST_URL}/index#monument/show/${item.monId}`, '_blank');
                    });

                    markersLayer.addLayer(marker);
                  }
                });
              });

              map.addLayer(markersLayer);
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }

    // Поиск автора
    function searchAuthor(my) {
      var input = my.inputs;

      var author = input.author.val();

      if (author) {
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
            console.log(response);
            if (response.length) {
              var list = my.columnsMaker(response);

              _.each(list, function(item) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
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
            console.log(response);
            if (response.length) {
              var list = my.columnsMaker(response);

              _.each(list, function(item) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                let type = item.resTypeId || 1;

                for (var i=0; i < item.x.length; i++) {
                  let icon = L.icon({
                    iconUrl: `/web_client/img/resTypes/resType${type}.png`,
                    iconSize: [20, 20]
                  });

                  let marker = L.marker(new L.LatLng(item.x[i], item.y[i]), {
                    icon: icon
                  });

                  let resHeader = `${item.autName}, ${item.resTypeName} (${item.resYear})`
                  marker.bindTooltip(resHeader, {
                    direction: 'top'
                  });

                  marker.on('mouseover', function(e) {
                    this.openTooltip();
                  });
                  marker.on('mouseout', function(e) {
                    this.closeTooltip();
                  });
                  marker.on('click', function(e) {
                    window.open(`${HOST_URL}/index#research/show/${item.resId}`, '_blank');
                  });

                  markersLayer.addLayer(marker);
                }
              });

              map.addLayer(markersLayer);
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
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
                $results.append(`<p>${ ctl(item) }</p>`);
              });
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
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
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                console.log(item)
                if (((item.x !== null) && (item.y !== null)) || ((item.spatrefX !== null) && (item.spatrefY !== null))) {
                  item.x = item.x || item.spatrefX;
                  item.y = item.y || item.spatrefY;
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
                    window.open(`${HOST_URL}/index#heritage/show/${item.id}`, '_blank');
                  });

                  markersLayer.addLayer(marker);
                }
              });

              map.addLayer(markersLayer);
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
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
                console.log($.parseJSON(response))
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
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              markersLayer.clearLayers();

              _.each(response, function(item) {
                let type = (item.area <= 20) ? 1 : 2;
                let icon = L.icon({
                  iconUrl: `/web_client/img/excTypes/excType${type}.png`,
                  iconSize: (type == 1) ? [16, 16] : [21, 21]
                });

                let marker = L.marker(new L.LatLng(item.x, item.y), {
                  icon: icon
                });

                let excHeader = `${item.name} (item.resYear)`
                marker.bindTooltip(excHeader, {
                  direction: 'top'
                });

                marker.on('mouseover', function(e) {
                  this.openTooltip();
                });
                marker.on('mouseout', function(e) {
                  this.closeTooltip();
                });
                marker.on('click', function(e) {
                  window.open(`${HOST_URL}/index#excavation/show/${item.id}`, '_blank');
                });

                markersLayer.addLayer(marker);
              });
            } else {
              $results.append(`<p>${ t('search.noResults') }</p>`);
            }
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }
  }
}));
