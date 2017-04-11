'use strict';

App.views.radiocarbon = new (Backbone.View.extend({
  "new_by_pub": function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;
    let markersLayer = new L.FeatureGroup();
    let monX, monY;

    const map = App.views.map().map;

    var repSelName = '',
        monSelName = '',
        orgName = '',
        resId = '';

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
      $('#pub-city-input-id').val(ui.item.id);

      App.models.Org.findByCityId(ui.item.id).then(function(orgs) {
        $('#pub-organization-input').autocomplete({
          source: _.map(orgs, function(org) {
            return {'label': org.name, 'id': org.id}
          })
        });
      });

      $("#pub-organization-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#pub-organization-input-id").val(ui.item.id);
          orgName = ui.item.name;
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    let aId = 1;

    $('.btn-new-coauthor').on('click', function(e) {
      let localAuthorId = aId++;

      App.views.functions.setAuthorAutocomplete($(this), localAuthorId);
    })
    
    let monId = 1;
    let excId = 1;
    let carbonId = 1;

    App.template.get("research/addMonument", function(tmpl) {
      $('#monument-next-button').before(tmpl({'monId': monId, 'needHeader': false}));
      getDataForSelector($(`#mon-date-scale-selector-${monId}`), "DateScale");

      $(`#monument-name-input-${monId}`).on("change", function() {
        let monName = $(this).val();
        $(`.mon-name-${monId}`).text(`${monName}: `)
      })

      $(`#monument-input-${monId}`).autocomplete({
        html: true,
        source: function(request, response) {
          var monuments = [];
          
          App.models.Monument.findByNamePrefix(request.term, resId)
            .then(function(data) {
              if (data && !data.error) {
                let inThisRes = false,
                    inThisResText = '',
                    label = '',
                    value = '';

                let results = _.map(excludeIdent(data), function(row) {
                  if (row.haveThisRes) {
                    inThisRes = true;
                    inThisResText = ' - Уже связан с этим исследованием';
                  } else {
                    inThisRes = false;
                    inThisResText = '';
                  }

                  label = `${row.monName} (${row.epName}, ${row.monType}) <b>${inThisResText}</b>`;
                  value = `${row.monName} (${row.epName}, ${row.monType})`;
                  return {'label': label, 'value': value, 'id': row.monId, 'inThisRes': inThisRes, 'kId': row.kId}
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

          $($(`#monument-new-coords-${monId}`)[0]).show().find("input, select").attr("used", true);
          $(`#monument-new-coords-button-${monId}`).remove();
          monumentResShowNew(monId);

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
              $(`#carbon-layer-1-${layerId}`).prop("disabled", !value);
              $(`#carbon-layer-1-${layerId}`)[0].checked = false;
              $(`#complex-layer-1-${layerId}`).prop("disabled", !value);
              $(`#complex-layer-1-${layerId}`)[0].checked = false;
            })
            $(`#exc-layer-1-${layerId}`).trigger("click");

            $(`#carbon-layer-1-${layerId}`).on("click", function() {
              $(`#complex-layer-1-${layerId}`).trigger("click");
            })
          });
          $button.trigger("click");

          getDataForSelector($(`#mon-type-selector-${monId}`), "MonumentType");
        } else if (lastSelectedAuthorId != ui.item.id) {
          if (ui.item.inThisRes) {
            monumentResHide(monId);
            $(`#knowledge-id-${monId}`).val(ui.item.kId);
          } else {
            monumentResShow(monId);
            $(`#knowledge-id-${monId}`).val("");
          }

          lastSelectedMonId = ui.item.id;
          $(`#monument-input-id-${monId}`).val(lastSelectedMonId);
          monSelName = ui.item.name;

          $($("#clarify-button-"+monId)[0]).show();

          let coords = App.models.Monument.getActualSpatref(ui.item.id);
          $.when(coords).then(function(coord) {
            monX = coord.x;
            monY = coord.y;
            $.when(App.models.Monument.findMonsByCoords(monX, monY)).then(monIds => {
              let mainMonId = [];
              mainMonId.push($(`#monument-input-id-${monId}`).val());
              monIds = _.extend(mainMonId, monIds).join(",");
              $(`#monument-clarify-input-id-${monId}`).val(monIds);
            })

            $(`#spatref-y-${monId}`).text(coord.y);
            $(`#spatref-x-${monId}`).text(coord.x);
            $(`#spatref-type-${monId}`).text(coord.typeName);
          })
        }
      });

      coordpicker($('#coord-picker-'+monId), {
        inputs: ['#monument-x-'+monId, '#monument-y-'+monId],
        map: map
      }, monId);
      getDataForSelector($("#spatref-selector-"+monId), "SpatialReferenceType", "", true);

      $("#clarify-button-"+monId).on("click", function() {
        $($(`#monument-new-coords-${monId}`)[0]).show().find("input, select").attr("used", true);
        $(`#monument-new-coords-button-${monId}`).remove();
      })
      
      let monLayers = App.views.functions.addMonRelation("exc", "m", monId, "Archaeological site");
      let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId);
      monLayers.append(checkbox);
      $(`#exc-belongs`).append(monLayers);
      $(`#exc-layer-1`)[0].checked = true;
      $(`#exc-layer-1`).prop("disabled", true);

      monLayers = App.views.functions.addMonRelation("carbon", "k", monId, "Archaeological site", "radio");
      checkbox = App.views.functions.addRelationCheckbox("carbon", "k", carbonId, monId, "radio");
      monLayers.append(checkbox);
      $(`#carbon-belongs`).append(monLayers);
      $(`#carbon-layer-1`)[0].checked = true;

      monLayers = App.views.functions.addMonRelation("complex", "m", monId, "Archaeological site", "radio");
      checkbox = App.views.functions.addRelationCheckbox("complex", "m", carbonId, monId, "radio");
      monLayers.append(checkbox);
      console.log(monLayers)
      console.log($(`#complex-belongs`))
      $(`#complex-belongs`).append(monLayers);
      $(`#complex-layer-1`)[0].checked = true;

      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}`), monId);
    })

    let fillResearchInputs = function() {
      let year = $("#pub-year-input").val();
      let name = $("#pub-name-input").val() + " - " + year;
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

        resId = '';
        monumentResHideAll();

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#pub-type-selector"), "PublicationType");
        getDataForSelector($("#edi-type-selector"), "EditionType");
        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });
      } else {
        resId = ui.item.resId;
        monumentResHideAll();

        $("#research-input-id").val(resId);
        $("#pub-input-id").val(ui.item.id);
        repSelName = ui.item.name;
      }
    });

    var lastSelectedCityId = 0;
    var lastSelectedCityName = '';
    $('#pub-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        lastSelectedCityName = ui.item.name;
        citySelectHandler(event, ui);
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

    $('#coauthor-input').on('autocompleteselect', function(event, ui) {
      App.store.coauthors[ui.item.id] = ui.item.value;
      this.value = _.values(App.store.coauthors).join(", ")+", ";
      $("#coauthor-input-id").val(_.keys(App.store.coauthors));
      return false;
    });

    $('#coauthor-input').on('autocompletefocus', function(event, ui) {
      return false;
    })

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#exc-spatref-selector"), "SpatialReferenceType", "", true);
    getDataForSelector($("#carbon-spatref-selector"), "SpatialReferenceType", "", true);
    getDataForSelector($("#culture-selector"), "Culture");
    getDataForSelector($("#mon-type-selector"), "MonumentType");
    getDataForSelector($("#carbon-date-type-selector"), "RadiocarbonDateType");
    getDataForSelector($("#carbon-genesis-selector"), "SludgeGenesis");
    getDataForSelector($("#carbon-material-selector"), "CarbonMaterial");
    getDataForSelector($("#carbon-facies-selector"), "Facies");

    $("#carbon-genesis-selector").on('click', function() {
      let genId = $(this).val();
      if (genId != 1 && genId != 10) {
        $("#carbon-facies-selector").attr('used', true);
        $("#div-carbon-facies-selector").show();

        $("#carbon-facies-selector").find(`option`).hide().attr('selected', false);
        $("#carbon-facies-selector").find(`option[info=${genId}]`).show();
        $("#carbon-facies-selector").find(`option[info=${genId}]:first`).attr('selected', true);
      } else {
        $("#carbon-facies-selector").attr('used', false);
        $("#div-carbon-facies-selector").hide();
      }
    })

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

    coordpicker($('#carbon-coord-picker'), {
      inputs: ['#carbon-x', '#carbon-y'],
      map: map
    });

    var photoId = 1;
    $('#add-photo-button').on('click', function(e) {
      var localPhotoId = photoId;
      var params = {
        photoId: localPhotoId
      }

      App.template.get("radiocarbon/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));
      })
      photoId++;
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
    
    $('.send-button').on('click', function() {
      App.views.functions.setPresentDate();
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery('carbon_1');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },
}));