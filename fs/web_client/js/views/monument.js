'use strict';

App.views.monument = new (Backbone.View.extend({
  'new': function() {
    var coordpicker = App.blocks.coordpicker;
    var fmt = App.fn.fmt;
    let addName = App.fn.addNameToId;
    let objectId = "m_1";

    const map = App.views.map().map;

    var repSelName = '',
        heritageSelName = '',
        orgName = '',
        resId = '';

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
        $('#author-birth-date-input').on('keyup mouseup', App.fn.checkYear);

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
      } else if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        lastSelectedAuthorName = ui.item.name;
        authorSelectHandler(event, ui);
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

        resId = '';
        monumentResHideAll();

        $input.parent().replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
        setSelectsEvents();
        fillResearchInputs();
        getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
      } else {
        resId = ui.item.resId;
        monumentResHideAll();
        
        $("#research-input-id").val(ui.item.resId);
        $("#report-input-id").val(ui.item.id);
        repSelName = ui.item.name;

        let query = JSON.stringify({
          "res:Research": {"id": ui.item.resId+"", "select": "*"},
            "exc:Excavation": {"id": "*", "select": "*"},
            "res__has__exc": {}
          });
        
          $.post({
            url: '/hquery/read',
            data: query,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
            },
            success: function(excs) {
              excs = JSON.parse(excs);
          
              $('#exc-input').autocomplete({
                source: _.map(excs.exc, function(r, key) {
                  return {'label': `${r.name} (Руководитель - ${r.boss})`, 'id': r.id}
                }),
                minLength: 0
              }).focus(function() {
                $(this).autocomplete("search");
              });
            }
          });
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


    $('#heritage-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });
    
    $('#heritage-input').on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('script.add-heritage').html() );

        $('.find-heritage').replaceWith( tmpl() );

        $('#' + addName(id)).val(inputValue);
      } else {
        $('#heritage-input-id').val(ui.item.id);
      }
    });


    // События для прослушивания размера файлов
    var checkFileSize = App.fn.checkFileSize;
    var $authorPhoto = $('#author-photo-input');
    $authorPhoto.change(checkFileSize.bind($authorPhoto, 10));

    var $heritage = $('#heritage-files-input');
    $heritage.change(checkFileSize.bind($heritage, 50));

    var $reportDoc = $('#report-file-input');
    $reportDoc.change(checkFileSize.bind($reportDoc, 50));

    // События для выбора года из диапазона от 0 до текущего года
    var checkYear = App.fn.checkYear;
    var $authorYear = $('#author-birth-date-input');
    $authorYear.bind('keyup mouseup', checkYear.bind($authorYear));

    var $repYear = $('#report-year-input');
    $repYear.bind('keyup mouseup', checkYear.bind($repYear));

    // Валидация полей с автокомплитом
    // var validate = App.fn.validInput;
    // validate('author-input', lastSelectedAuthorName);
    // validate('report-input', repSelName);
    // validate('report-city-input', lastSelectedCityName);
    // validate('report-organization-input', orgName);
    // validate('heritage-input', heritageSelName);


    function fillResearchInputs() {
      let year = $("#report-year-input").val();
      let name = $("#report-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
    };

    $('.send-button').on('click', function() {
      App.views.functions.setPresentDate();
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery(objectId);
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
    setSelectsEvents();

    let aId = 1;

    $('.btn-new-coauthor').on('click', function(e) {
      let localAuthorId = aId++;

      App.views.functions.setAuthorAutocomplete($(this), localAuthorId);
    })

    let monId = 1;
    let excludeIdent = App.fn.excludeIdentMonuments;

    App.template.get("research/addMonument", function(tmpl) {
      let monX, monY;

      getDataForSelector($(`#mon-date-scale-selector-${monId}`), "DateScale");

      $('#monument').find("legend").after(tmpl({'monId': monId, 'needHeader': false}));      

      $(`#monument-name-input-${monId}`).on("change", function() {
        let monName = $(this).val();
        $(`.mon-name-${monId}`).text(`${monName}: `);
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

                  let cult = row.cult || App.locale.translate('common.noCulture');
                    
                  label = `${row.monName} (${row.epName}, ${row.monType}, ${cult}) <b>${inThisResText}</b>`;
                  value = `${row.monName} (${row.epName}, ${row.monType}, ${cult})`;
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
          objectId = "m_1_1";

          let monLayers = $(`.mon-checkboxes-${monId}`);
          monLayers.find("input").remove();
          $(`#monument-name-input-${monId}`).trigger("change");

          let $button = $(`#add-layer-button-${monId}`);
          $button.on("click", () => App.views.functions.addLayer($button, monId, layerCounter()));
          $button.on("click", () => {
            let layerId = layerCounter2();
            _.each($(`.mon-checkboxes-${monId}[data-entity="exc"]`), function(layers, excId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, monId, layerId);
              $(layers).append(checkbox);
            })
            _.each($(`.mon-checkboxes-${monId}[data-entity="photo"]`), function(layers, photoId) {
              let checkbox = App.views.functions.addLayerCheckbox("photo", "k", photoId+1, monId, layerId);
              $(layers).append(checkbox);
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

            $(`#spatref-y-${monId}`).text(monY);
            $(`#spatref-x-${monId}`).text(monX);
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
      
      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}`), monId);

      let excCounter = App.fn.counter(1);
      $("#add-exc-button").on('click', function(e) {
        let excId = excCounter();

        $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
          let monName = $(".monument-name").val() || "Памятник";
          let layers = $(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", "m", monId, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
    })

    // let excId = 1;
    // $('#add-exc-button').on('click', function(e) {
    //   let localExcId = excId;
    //   let params = {
    //     excId: localExcId
    //   }

    //   App.template.get("", function(tmpl) {
    //     $('#add-exc-button').before(tmpl(params));
    //   })
    //   excId++;
    // });

    let nextPhotoId = App.fn.counter(1);
    $('#add-photo-button').on('click', function(e) {
      let photoId = nextPhotoId();
      let params = {
        photoId: photoId
      }

      App.template.get("monument/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));

        let monName = $(".monument-name").val() || "Памятник";
        let layers = $(".mon-layer");
        let monLayers = App.views.functions.addMonRelation("photo", "k", monId, monName);

        if (layers.length > 0) {
          _.each(layers, function(layer, layerId) {
            let checkbox = App.views.functions.addLayerCheckbox("photo", "k", photoId, monId, layerId+1)
            monLayers.append(checkbox);
          })
        } else {
          let checkbox = App.views.functions.addRelationCheckbox("photo", "k", photoId, monId)
          monLayers.append(checkbox);
        }

        $(`#photo-belongs-${photoId}`).append(monLayers)

        getDataForSelector($(`#photo-view-selector-${photoId}`), "CardinalDirection");
        App.views.functions.setAccordionHeader($(`#photo-header-${photoId}`));
      })
    });

    let nextTopoId = App.fn.counter(1);
    $('#add-topo-button').on('click', function(e) {
      let localTopoId = nextTopoId();
      let params = {
        topoId: localTopoId
      }

      App.template.get("monument/addTopoplan", function(tmpl) {
        $('#add-topo-button').before(tmpl(params));

        App.views.functions.setAccordionHeader($(`#topo-header-${localTopoId}`));
      })
    });

    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: map
    });
    
    $("#container").tabs();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    });
  },

  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");
  },

  "new_by_pub": function() {
    let coordpicker = App.blocks.coordpicker;
    let fmt = App.fn.fmt;
    let excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;
    let repSelName = '';
    let objectId = "m_1";
    let monX, monY;
    let resId = '';

    const map = App.views.map().map;

    getDataForSelector($("#epoch-selector"), "Epoch");
    getDataForSelector($("#mon-type-selector"), "MonumentType");

    coordpicker($('#coord-picker'), {
      inputs: ['#monument-x', '#monument-y'],
      map: map
    });

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

    let aId = 1;

    $('.btn-new-coauthor').on('click', function(e) {
      let localAuthorId = aId++;

      App.views.functions.setAuthorAutocomplete($(this), localAuthorId);
    })

    let monId = 1;
    App.template.get("research/addMonument", function(tmpl) {
      $('#monument').find("legend").after(tmpl({'monId': monId, 'needHeader': false}));

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

                  let cult = row.cult || App.locale.translate('common.noCulture');
                    
                  label = `${row.monName} (${row.epName}, ${row.monType}, ${cult}) <b>${inThisResText}</b>`;
                  value = `${row.monName} (${row.epName}, ${row.monType}, ${cult})`;
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
          objectId = "m_1_1";

          let monLayers = $(`.mon-checkboxes-${monId}`);
          monLayers.find("input").remove();
          $(`#monument-name-input-${monId}`).trigger("change");

          let $button = $(`#add-layer-button-${monId}`);
          $button.on("click", () => App.views.functions.addLayer($button, monId, layerCounter()));
          $button.on("click", () => {
            let layerId = layerCounter2();
            _.each(monLayers, function(layers, excId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, monId, layerId);
              $(layers).append(checkbox);
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
      
      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}`), monId);

      let excCounter = App.fn.counter(1);
      $("#add-exc-button").on('click', function(e) {
        let excId = excCounter();

        $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
          let monName = $(".monument-name").val() || "Памятник";
          let layers = $(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", "m", monId, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
    })
    
    let nextTopoId = App.fn.counter(1);
    $('#add-topo-button').on('click', function(e) {
      let localTopoId = nextTopoId();
      let params = {
        topoId: localTopoId
      }

      App.template.get("monument/addTopoplan", function(tmpl) {
        $('#add-topo-button').before(tmpl(params));

        App.views.functions.setAccordionHeader($(`#topo-header-${localTopoId}`));
      })
    });
    
    $("#container").tabs();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })

    function fillResearchInputs() {
      let year = $("#pub-year-input").val();
      let name = $("#pub-name-input").val() + " - " + year;
      $("#research-input-name").val(name);
      $("#research-input-year").val(year);
    };

    $('.send-button').on('click', function() {
      App.views.functions.setPresentDate();
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery(objectId);
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },

  "red": function() {
    
  },

  "new_by_xlsx": function() {
    
  },

  "new_by_arch_map": function(context) {
    console.log(context);
  }
}));
