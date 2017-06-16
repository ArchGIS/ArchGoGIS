'use strict';

App.views.search = new (Backbone.View.extend({
  'index': function() {
    const loc = App.locale;
    const lang = loc.getLang();
    const t = loc.translate;
    const ctl = lang === "en" ? loc.cyrToLatin : src => src;
    const prefix = lang === 'ru' ? '' : `${lang}_`;

    const excludeIdent = App.fn.excludeIdentMonuments;

    const mapInstance = App.views.map();
    let overlays = null;

    const $results = $('#search-results');

    const $objectToggler = App.page.get('objectToggler');
    let object = null;
    let objects = {
      'monument-params': {
        'handler': searchMonument,
        'columnsMaker': function(monuments) {
          return _.map(excludeIdent(monuments), function(mk) {
            return App.models.Monument.href(mk.monId, `${mk.monName} (${mk[prefix + 'epName']}, ${mk[prefix + 'monType']})`);
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
            return App.models.Research.href(r.resId, `${r.autName}, ${r[prefix + 'resTypeName']} (${r.resYear})`);
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
            return App.models.Heritage.href(r.id, `${r.name ? r.name : t('common.noName')}`);
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
      },
      'radiocarbon-params': {
        'handler': searchRadiocarbon,
        'columnsMaker': function(radiocarbons) {
          return _.map(radiocarbons, function(r) {
            return App.models.Radiocarbon.href(r.carbon.id, `${r.carbon.name}`);
          });
        },
        'inputs': {
          'name': $('#radiocarbon-index-input'),
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
    $epoch.prepend(`<option value="0" selected>${ t('common.nothingIsSelected') }</option>`);
    getDataForSelector($monType, 'MonumentType');
    $monType.prepend(`<option value="0" selected>${t ('common.nothingIsSelected') }</option>`);
    getDataForSelector($culture, 'Culture');
    $culture.prepend(`<option value="0" selected>${ t('common.nothingIsSelected') }</option>`);

    // Смена искомого объекта.
    $objectToggler.setCallback(function($object) {
      $results.empty();
      App.views.clearOverlays(overlays);
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
              const list = my.columnsMaker(response);
              const coords = [], uniqMons = [], placemarks = [];

              _.each(response, (item) => {
                if (App.utils.isNotExistID(uniqMons, 'monId', item.monId)) {
                  uniqMons.push(item);
                }
              });

              _.each(uniqMons, function(item, i) {
                coords[i] = App.models.Monument.getActualSpatref(item.monId);
              });

              _.each(list, function(item, i) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              App.views.clearOverlays(overlays);

              _.each(uniqMons, function(item, i) {
                $.when(coords[i]).then(function(coord) {
                  if ((coord.x != "нет данных" && coord.y != "нет данных") &&
                      (coord.x && coord.y) || 
                      (item.x && item.y)) {
                        const type = item.monTypeId || 10;
                        const epoch = item.ep || 0;
                        const preset = `monType${type}_${epoch}`;

                        coord.x = item.x || coord.x;
                        coord.y = item.y || coord.y;

                        placemarks.push(
                          App.controllers.fn.createStandartPlacemark('monument', item.monId, coord.x, coord.y, ctl(item.monName), preset)
                        );
                      }
                })
              });

              $.when(...coords).then((coord) => {
                overlays = App.views.addToMap(placemarks, mapInstance);
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
              const list = my.columnsMaker(response);
              const placemarks = [];

              _.each(list, function(item) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              App.views.clearOverlays(overlays);

              _.each(response, function(item, i) {
                const type = item.resTypeId || 1;
                const preset = `resType${type}`;

                _.times(item.x.length, (n) => {
                  placemarks.push(
                    App.controllers.fn.createStandartPlacemark('research', item.resId, item.x[n], item.y[n], ctl(item.resName), preset)
                  );
                });
              });

              overlays = App.views.addToMap(placemarks, mapInstance);
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
              const list = my.columnsMaker(response);
              const placemarks = [];

              _.each(list, function(item) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              App.views.clearOverlays(overlays);

              _.each(response, function(item, i) {
                if (((item.x !== null) && (item.y !== null)) || ((item.spatrefX !== null) && (item.spatrefY !== null))) {
                  item.x = item.x || item.spatrefX;
                  item.y = item.y || item.spatrefY;
                  const preset = `heritage`;

                  placemarks.push(
                    App.controllers.fn.createStandartPlacemark('heritage', item.id, item.x, item.y, ctl(item.name), preset)
                  );
                }
              });

              overlays = App.views.addToMap(placemarks, mapInstance);
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
              const list = my.columnsMaker(response);
              const placemarks = [];

              _.each(list, function(item) {
                $results.append(`<p>${ ctl(item) }</p>`);
              });

              App.views.clearOverlays(overlays);

              _.each(response, function(item, i) {
                const type = (item.area <= 20) ? 1 : 2;
                const preset = `excType${type}`;

                placemarks.push(
                  App.controllers.fn.createStandartPlacemark('excavation', item.id, item.x, item.y, ctl(item.name), preset)
                );
              });

              overlays = App.views.addToMap(placemarks, mapInstance);
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

    function searchRadiocarbon(my) {
      var input = my.inputs;

      var name = input.name.val() || "";

      function find() {
        return new Promise(function(resolve, reject) {
          var url = App.url.make('/search/filter_radiocarbons', {
            'name': name,
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
            const list = my.columnsMaker(response);
            const spatref = {};
            const placemarks = [];

            _.each(list, function(item) {
              $results.append(`<p>${ ctl(item) }</p>`);
            });
            
            App.views.clearOverlays(overlays);

            let lastId = 0;            
            _.each(response, function(item, i) {
              if (lastId === item.id) return;

              const preset = 'c14';

              if (item.x && item.y) {
                spatref.x = item.x;
                spatref.y = item.y;
              } else if (item.excX && item.excY) {
                spatref.x = item.excX;
                spatref.y = item.excY;
              } else if (item.monX && item.monY) {
                spatref.x = item.monX;
                spatref.y = item.monY;
              } else {
                console.log(item.id)
                return 1;
              }

              lastId = item.id;

              placemarks.push(
                App.controllers.fn.createStandartPlacemark('radiocarbon', item.carbon.id, spatref.x, spatref.y, ctl(item.carbon.name), preset)
              );
            });

            overlays = App.views.addToMap(placemarks, mapInstance);
          } else {
            $results.append(`<p>${ t('search.noResults') }</p>`);
          }
        }, function(error) {
          console.log(error);
        });
    }
  }
}));
