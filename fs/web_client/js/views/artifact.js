'use strict';

App.views.artifact = new (Backbone.View.extend({
  'new_by_research': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;

    var resSelName = '',
        monSelName = '',
        orgName = '';

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
          resSelName = ui.item.name;
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
                return {'label': `${row.monName} (${row.epName}, ${row.monType})`, 'id': row.monId};
              }))
            } else {
              response();
            }
          });
      },
      minLength: 3,
      select: function(event, ui) {
        $("#monument-input-id").val(ui.item.id);
        monSelName = ui.item.name;
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
    var lastSelectedCityName = '';
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        lastSelectedCityName = ui.item.name;
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

    // Валидация полей с автокомплитом
    var validate = App.fn.validInput;
    validate('author-input', lastSelectedAuthorName);
    validate('research-input', resSelName);
    validate('report-city-input', lastSelectedCityName);
    validate('report-organization-input', orgName);
    validate('monument-input', monSelName);


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
      if ( isValidForm() ) {
        postQuery('a');
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
  },

  'new_by_report': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;

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
                console.log(row)
                return {'label': `${row.monName} (${row.epName}, ${row.monType})`, 'id': row.monId};
              }))
            } else {
              response();
            }
          });
      },
      minLength: 3,
      select: function(event, ui) {
        $("#monument-input-id").val(ui.item.id);
        monSelName = ui.item.name;
      }
    }).focus(function(){
      $(this).autocomplete("search");
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
    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
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
      map: 'map'
    });

    coordpicker($('#exc-coord-picker'), {
      inputs: ['#exc-x', '#exc-y'],
      map: 'map'
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
    return `<a target="_blank" href="#artifact/show/${id}">${text}</a>`;
  }

}));
