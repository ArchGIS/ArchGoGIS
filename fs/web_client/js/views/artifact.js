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

    let monId = 1;
    let excId = 1;
    let artiId = 1;
    App.template.get("research/addMonument", function(tmpl) {
      $('#monument-next-button').before(tmpl({'monId': monId, 'needHeader': false}));

      $(`#monument-name-input-${monId}`).on("change", function() {
        let monName = $(this).val();
        $(`.mon-name-${monId}`).text(`${monName}: `)
      })

      $(`#monument-input-${monId}`).autocomplete({
        source: function(request, response) {
          var monuments = [];
          
          App.models.Monument.findByNamePrefix(request.term)
            .then(function(data) {
              if (data && !data.error) {
                let results = _.map(excludeIdent(data), function(row) {
                  return {'label': `${row.monName} (${row.epName}, ${row.monType})`, 'id': row.monId}
                });

                if (!results.length) {
                  results.push('Ничего не найдено. Добавить?');
                }

                response(results);
              } else {
                response();
              }
            });
        },
        minLength: 3
      }).focus(function(){
        $(this).autocomplete("search");
      });

      $(`#monument-input-${monId}`).on('autocompletefocus', function(event, ui) {
        event.preventDefault();
      });

      let lastSelectedMonId = 0;
      let monSelName = '';
      $(`#monument-input-${monId}`).on('autocompleteselect', function(event, ui) {
        if (ui.item.value === 'Ничего не найдено. Добавить?') {
          let $input = $(this);
          let id = $input.attr('id');
          let inputValue = $input.val();

          let tmpl = _.template( $(`script.add-monument-${monId}`).html() );
          $(`.find-monument-${monId}`).replaceWith( tmpl({'monId': monId}) );

          tmpl = _.template( $(`script#add-layer-${monId}`).html() );
          $(`#place-for-layers-${monId}`).replaceWith( tmpl({'monId': monId}) );

          $('#' + addName(id)).val(inputValue);

          var coordpicker = App.blocks.coordpicker;
          coordpicker($('#coord-picker-'+monId), {
            inputs: ['#monument-x-'+monId, '#monument-y-'+monId],
            map: map
          }, monId);

          let layerCounter = App.fn.counter(1);
          let layerCounter2 = App.fn.counter(1);

          let monLayers = $(`.mon-checkboxes-${monId}`);
          monLayers.find("input").remove();
          $(`#monument-name-input-${monId}`).trigger("change");

          let $button = $(`#add-layer-button-${monId}`);
          $button.on("click", () => App.views.functions.addLayer($button, monId, layerCounter()));
          $button.on("click", () => {
            let layerId = layerCounter2();
            _.each(monLayers, function(layers) {
              let inputType = $(layers).attr("data-input-type");
              let entity = $(layers).attr("data-entity");
              let entityWith = $(layers).attr("data-entity-with");
              let checkbox = App.views.functions.addLayerCheckbox(entity, entityWith, excId, monId, layerId, inputType);
              $(layers).append(checkbox);
            })

            $(`#exc-layer-1-${layerId}`).on("click", function() {
              let value = $(this).is(":checked");
              $(`#arti-layer-1-${layerId}`).prop("disabled", !value);
              $(`#arti-layer-1-${layerId}`)[0].checked = false;
              $(`#complex-layer-1-${layerId}`).prop("disabled", !value);
              $(`#complex-layer-1-${layerId}`)[0].checked = false;
            })
            $(`#exc-layer-1-${layerId}`).trigger("click");

            $(`#arti-layer-1-${layerId}`).on("click", function() {
              $(`#complex-layer-1-${layerId}`).trigger("click");
            })
          });
          $button.trigger("click");

          getDataForSelector($(`#mon-type-selector-${monId}`), "MonumentType");
        } else if (lastSelectedAuthorId != ui.item.id) {
          lastSelectedMonId = ui.item.id;
          $(`#monument-input-id-${monId}`).val(lastSelectedMonId);
          monSelName = ui.item.name;
        }
      });
      
      let monLayers = App.views.functions.addMonRelation("exc", "m", monId, "Памятник");
      let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId);
      monLayers.append(checkbox);
      $(`#exc-belongs`).append(monLayers);
      $(`#exc-layer-1`)[0].checked = true;
      $(`#exc-layer-1`).prop("disabled", true);

      monLayers = App.views.functions.addMonRelation("arti", "k", monId, "Памятник", "radio");
      checkbox = App.views.functions.addRelationCheckbox("arti", "k", artiId, monId, "radio");
      monLayers.append(checkbox);
      $(`#arti-belongs`).append(monLayers);
      $(`#arti-layer-1`)[0].checked = true;

      monLayers = App.views.functions.addMonRelation("complex", "m", monId, "Памятник", "radio");
      checkbox = App.views.functions.addRelationCheckbox("complex", "m", artiId, monId, "radio");
      monLayers.append(checkbox);
      $(`#complex-belongs`).append(monLayers);
      $(`#complex-layer-1`)[0].checked = true;

      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}`), monId);
      App.views.functions.setCultureAutocomplete($(`#culture-input-art`), 1, 0, "artiCulture");
    })

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

    let fillResearchInputs = function() {
      let year = $("#report-year-input").val();
      let name = $("#report-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
      $("#research-input-year").val(year);
    };

    let lastSelectedAuthorId = 0;
    let lastSelectedAuthorName = '';
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
        getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
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
        getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
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
    getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");

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
        postQuery('arti_1');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },

  "new_by_pub": function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;

    const map = App.views.map().map;

    var repSelName = '',
        monSelName = '',
        orgName = '';

    let authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Publication.findByAuthorId(ui.item.id).then(function(pubs) {
        $('#pub-input').autocomplete({
          source: _.map(pubs.pub, function(pub, key) {
            return {'label': `${pub.name} (${pub.published_at})`, 'id': pub.id, 'resId': pubs.res[key].id}
          })
        });
      });

      $("#pub-input").autocomplete({
        source: [],
        minLength: 0
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

    let monId = 1;
    let excId = 1;
    let artiId = 1;
    App.template.get("research/addMonument", function(tmpl) {
      $('#monument-next-button').before(tmpl({'monId': monId, 'needHeader': false}));

      $(`#monument-name-input-${monId}`).on("change", function() {
        let monName = $(this).val();
        $(`.mon-name-${monId}`).text(`${monName}: `)
      })

      $(`#monument-input-${monId}`).autocomplete({
        source: function(request, response) {
          var monuments = [];
          
          App.models.Monument.findByNamePrefix(request.term)
            .then(function(data) {
              if (data && !data.error) {
                let results = _.map(excludeIdent(data), function(row) {
                  return {'label': `${row.monName} (${row.epName}, ${row.monType})`, 'id': row.monId}
                });

                if (!results.length) {
                  results.push('Ничего не найдено. Добавить?');
                }

                response(results);
              } else {
                response();
              }
            });
        },
        minLength: 3
      }).focus(function(){
        $(this).autocomplete("search");
      });

      $(`#monument-input-${monId}`).on('autocompletefocus', function(event, ui) {
        event.preventDefault();
      });

      let lastSelectedMonId = 0;
      let monSelName = '';
      $(`#monument-input-${monId}`).on('autocompleteselect', function(event, ui) {
        if (ui.item.value === 'Ничего не найдено. Добавить?') {
          let $input = $(this);
          let id = $input.attr('id');
          let inputValue = $input.val();

          let tmpl = _.template( $(`script.add-monument-${monId}`).html() );
          $(`.find-monument-${monId}`).replaceWith( tmpl({'monId': monId}) );

          tmpl = _.template( $(`script#add-layer-${monId}`).html() );
          $(`#place-for-layers-${monId}`).replaceWith( tmpl({'monId': monId}) );

          $('#' + addName(id)).val(inputValue);

          var coordpicker = App.blocks.coordpicker;
          coordpicker($('#coord-picker-'+monId), {
            inputs: ['#monument-x-'+monId, '#monument-y-'+monId],
            map: map
          }, monId);

          let layerCounter = App.fn.counter(1);
          let layerCounter2 = App.fn.counter(1);

          let monLayers = $(`.mon-checkboxes-${monId}`);
          monLayers.find("input").remove();
          $(`#monument-name-input-${monId}`).trigger("change");

          let $button = $(`#add-layer-button-${monId}`);
          $button.on("click", () => App.views.functions.addLayer($button, monId, layerCounter()));
          $button.on("click", () => {
            let layerId = layerCounter2();
            _.each(monLayers, function(layers) {
              let inputType = $(layers).attr("data-input-type");
              let entity = $(layers).attr("data-entity");
              let entityWith = $(layers).attr("data-entity-with");
              let checkbox = App.views.functions.addLayerCheckbox(entity, entityWith, excId, monId, layerId, inputType);
              $(layers).append(checkbox);
            })

            $(`#exc-layer-1-${layerId}`).on("click", function() {
              let value = $(this).is(":checked");
              $(`#arti-layer-1-${layerId}`).prop("disabled", !value);
              $(`#arti-layer-1-${layerId}`)[0].checked = false;
              $(`#complex-layer-1-${layerId}`).prop("disabled", !value);
              $(`#complex-layer-1-${layerId}`)[0].checked = false;
            })
            $(`#exc-layer-1-${layerId}`).trigger("click");

            $(`#arti-layer-1-${layerId}`).on("click", function() {
              $(`#complex-layer-1-${layerId}`).trigger("click");
            })
          });
          $button.trigger("click");

          getDataForSelector($(`#mon-type-selector-${monId}`), "MonumentType");
        } else if (lastSelectedAuthorId != ui.item.id) {
          lastSelectedMonId = ui.item.id;
          $(`#monument-input-id-${monId}`).val(lastSelectedMonId);
          monSelName = ui.item.name;
        }
      });
      
      let monLayers = App.views.functions.addMonRelation("exc", "m", monId, "Памятник");
      let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId);
      monLayers.append(checkbox);
      $(`#exc-belongs`).append(monLayers);
      $(`#exc-layer-1`)[0].checked = true;
      $(`#exc-layer-1`).prop("disabled", true);

      monLayers = App.views.functions.addMonRelation("arti", "k", monId, "Памятник", "radio");
      checkbox = App.views.functions.addRelationCheckbox("arti", "k", artiId, monId, "radio");
      monLayers.append(checkbox);
      $(`#arti-belongs`).append(monLayers);
      $(`#arti-layer-1`)[0].checked = true;

      monLayers = App.views.functions.addMonRelation("complex", "m", monId, "Памятник", "radio");
      checkbox = App.views.functions.addRelationCheckbox("complex", "m", artiId, monId, "radio");
      monLayers.append(checkbox);
      $(`#complex-belongs`).append(monLayers);
      $(`#complex-layer-1`)[0].checked = true;

      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}`), monId);
      App.views.functions.setCultureAutocomplete($(`#culture-input-art`), 1, 0, "artiCulture");
    })

    let fillResearchInputs = function() {
      let year = $("#report-year-input").val();
      let name = $("#report-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
      $("#research-input-year").val(year);
    };

    let lastSelectedAuthorId = 0;
    let lastSelectedAuthorName = '';
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
        tmpl = _.template( $('script.add-pub').html() );
        $('.find-pub').replaceWith( tmpl() );
        $('#author-birth-date-input').on('keyup mouseup', App.fn.checkYear);

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#pub-type-selector"), "PublicationType");
        getDataForSelector($("#edi-type-selector"), "EditionType");
        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
      }
    });

    $('#pub-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('#pub-input').on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'label': 'Ничего не найдено. Добавить?',
          'value': 'Ничего не найдено. Добавить?'
        });
      }
    });

    $('#pub-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-pub').html() );

        $input.parent().replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#pub-type-selector"), "PublicationType");
        getDataForSelector($("#edi-type-selector"), "EditionType");
        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      } else {
        $("#research-input-id").val(ui.item.resId);
        $("#pub-input-id").val(ui.item.id);
        repSelName = ui.item.name;
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
        postQuery('arti_1');
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
