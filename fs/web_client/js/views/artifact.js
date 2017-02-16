'use strict';

App.views.artifact = new (Backbone.View.extend({
  'new_by_report': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;

    const map = App.views.map().map;

    var repSelName = '',
        monSelName = '',
        orgName = '';

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorIdFullInfo(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports.r, function(r, key) {
            return {'label': `${r.name} (${r.year}, ${reports.rt[key].name})`, 'id': r.id, 'resId': reports.res[key].id}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          var resId = ui.item.resId;

          $("#research-input-id").val(resId);
          $("#report-input-id").val(ui.item.id);
          repSelName = ui.item.name;
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
          orgName = ui.item.name;
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
              response(_.map(excludeIdent(data), function(row) {
                return {'label': `${row.monName}`, 'id': row.monId};
              }))
            } else {
              response();
            }
          });
      },
      minLength: 3
    }).focus(function(){
      $(this).autocomplete("search");
    });

    $(`#monument-input`).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#monument-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    let lastSelectedMonId = 0;
    $(`#monument-input`).on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $(`script.add-monument`).html() );
        $(`.find-monument`).replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);

        fillSelector($(`#epoch-selector`), App.store.selectData.Epoch);
        fillSelector($(`#mon-type-selector`), App.store.selectData.MonumentType);
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedMonId = ui.item.id;
        $(`#monument-input-id`).val(lastSelectedMonId);
        monSelName = ui.item.name;
      }
    });


    let d_culture = $.Deferred();
    (function() {
      let query = {};
      query['rows:Culture'] = {"id": "*", "select": "*"};
      query = JSON.stringify(query);

      $.post({
        url: "/hquery/read",
        data: query,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: (response) => {
          App.store.selectData.Culture = JSON.parse(response);
          d_culture.resolve();
        }
      });
    }());

    $.when( d_culture ).done(() => {
      let items = _.map(App.store.selectData.Culture.rows, culture => ({'id': culture.id, 'label': culture.name}));
      let grepObject = App.fn.grepObject;

      $(`#culture-input`).autocomplete({
        source: function(req, res) {
          let term = req.term.toLowerCase();
          
          res(grepObject(term, items, 'label'));
        },
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    });

    $(`#culture-input`).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $(`#culture-input`).on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'value': 'Ничего не найдено. Добавить?',
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });
    
    $(`#culture-input`).on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $(`script.add-culture`).html() );
        $(`.find-culture`).replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $(`#culture-input-id`).val(ui.item.id);
      }
    });


    $.when( d_culture ).done(() => {
      let items = _.map(App.store.selectData.Culture.rows, culture => ({'id': culture.id, 'label': culture.name}));
      let grepObject = App.fn.grepObject;

      $(`#culture-input-art`).autocomplete({
        source: function(req, res) {
          let term = req.term.toLowerCase();
          
          res(grepObject(term, items, 'label'));
        },
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    });

    $(`#culture-input-art`).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $(`#culture-input-art`).on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'value': 'Ничего не найдено. Добавить?',
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });
    
    $(`#culture-input-art`).on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $(`script.add-culture-art`).html() );
        $(`.find-culture-art`).replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $(`#culture-input-art-id`).val(ui.item.id);
      }
    });

    $("#collection-input").autocomplete({
      source: function(request, response) {
        var monuments = [];

        App.models.Collection.findByNamePrefix(request.term)
          .then(function(data) {
            if (data && !data.error) {
              response(_.map(data, function(row) {
                return {'label': row.name, 'id': row.id};
              }))
            } else {
              response();
            }
          });
      },
      minLength: 3
    }).focus(function(){
      $(this).autocomplete("search");
    });

    $(`#collection-input`).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $(`#collection-input`).on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'value': 'empty',
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $(`#collection-input`).on('autocompleteselect', function(event, ui) {
      if (ui.item.value  == 'empty') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $(`script.add-collection`).html() );
        $(`#find-collection`).replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $(`#collection-input-id`).val(ui.item.id);
      }
    });

    var fillResearchInputs = function() {
      if ($("#new-report-checkbox").is(":checked") == true) {
        var year = $("#report-year-input").val();
        var name = $("#report-name-input").val() + " - " + year;
        $("#research-input-name").val(name);
        $("#research-input-year").val(year);
      }
    };

    var lastSelectedAuthorId = 0;
    var lastSelectedAuthorName = '';
    $('#author-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-author').html() );
        $('.find-author').replaceWith( tmpl() );
        tmpl = _.template( $('script.add-report').html() );
        $('.find-report').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        fillSelector($('#research-type-selector'), App.store.selectData.ResearchType);
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
      }
    });


    $('#report-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#report-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $('#report-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-report').html() );
        $('.find-report').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        fillSelector($('#research-type-selector'), App.store.selectData.ResearchType);
      }
    });


    var lastSelectedCityId = 0;
    var lastSelectedCityName = '';
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        lastSelectedCityName = ui.item.name;
        citySelectHandler(event, ui);
      } 
    });

    var cats = App.models.artiCategory.getAll()
    cats.then(function(response) {
      var categories = _.map(response.rows, cat => ({'id': cat.id, 'label': cat.name}))
      $("#arti-category-input").autocomplete({
        'minLength': 3,
        'source': function(request, response) {
          response($.ui.autocomplete.filter(categories, _.last(request.term.split(", "))));
        },
      });
    })

    $("#arti-category-input").bind("keyup", function(event) {
      if (event.keyCode === $.ui.keyCode.BACKSPACE) {
        var categories = _.values(App.store.categories);
        var input = this.value.split(', ');

        if (categories.length == input.length) {
          this.value = categories.join(", ") + ", ";
        } else {
          var inter = _.intersection(categories, input);
          this.value = (inter.length) ? inter.join(", ") + ", " : "";

          App.store.categories = _.pick(App.store.categories, value => _.contains(inter, value));
        }
        $("#arti-category-input-id").val(_.keys(App.store.categories));
      }
    });

    $("#arti-category-input").on('autocompleteselect', function(event, ui) {
      App.store.categories[ui.item.id] = ui.item.value;
      this.value = _.values(App.store.categories).join(", ")+", ";
      $("#arti-category-input-id").val(_.keys(App.store.categories));
      return false;
    });

    $("#arti-category-input").on('autocompletefocus', function(event, ui) {
      return false;
    })

    var mats = App.models.artiMaterial.getAll()
    mats.then(function(response) {
      var materials = _.map(response.rows, mat => ({'id': mat.id, 'label': mat.name}))
      $("#arti-material-input").autocomplete({
        'minLength': 3,
        'source': function(request, response) {
          response($.ui.autocomplete.filter(materials, _.last(request.term.split(", "))));
        },
      });
    })

    $("#arti-material-input").bind("keyup", function(event) {
      if (event.keyCode === $.ui.keyCode.BACKSPACE) {
        var materials = _.values(App.store.materials);
        var input = this.value.split(', ');

        if (materials.length == input.length) {
          this.value = materials.join(", ") + ", ";
        } else {
          var inter = _.intersection(materials, input);
          this.value = (inter.length) ? inter.join(", ") + ", " : "";

          App.store.materials = _.pick(App.store.materials, value => _.contains(inter, value));
        }
        $("#arti-material-input-id").val(_.keys(App.store.materials));
      }
    });

    $("#arti-material-input").on('autocompleteselect', function(event, ui) {
      App.store.materials[ui.item.id] = ui.item.value;
      this.value = _.values(App.store.materials).join(", ")+", ";
      $("#arti-material-input-id").val(_.keys(App.store.materials));
      return false;
    });

    $("#arti-material-input").on('autocompletefocus', function(event, ui) {
      return false;
    })

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#culture-selector"), "Culture");
    getDataForSelector($("#arti-culture-selector"), "Culture");
    getDataForSelector($("#mon-type-selector"), "MonumentType");
    getDataForSelector($("#arti-date-scale-selector"), "DateScale");
    getDataForSelector($("#research-type-selector"), "ResearchType");

    $("#container").tabs();
    setSelectsEvents();

    coordpicker($('#monument-coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: map
    });

    coordpicker($('#exc-coord-picker'), {
      inputs: ['#exc-x', '#exc-y'],
      map: map
    });

    var photoId = 1;
    $('#add-photo-button').on('click', function(e) {
      var localPhotoId = photoId;
      var params = {
        photoId: localPhotoId
      }

      App.template.get("artifact/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));
      })
      photoId++;
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
    
    $('#send-button').on('click', function() {
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery('arti');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },

  'href': function(id, text) {
    return `<a href="#artifact/show/${id}">${text}</a>`;
  },

  'show': (placemarks) => {
    App.views.addToMap(placemarks);

    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");
  }
}));
