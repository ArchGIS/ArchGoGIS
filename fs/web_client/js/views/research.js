'use strict';

App.views.research = new (Backbone.View.extend({
  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    App.views.functions.setAccordion("#accordion");
    $('#container').tabs();
  },

  "new_by_report": function(argument) {
    var fmt = App.fn.fmt;
    var excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;
    var coordpicker = App.blocks.coordpicker;

    const map = App.views.map().map;

    var counter = 1;
    var reportName,
        orgName = '';
    var reportYear;
    
    getDataForSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
    setSelectsEvents();

    var fillResearchInputs = function() {
      if ($("#report-input-id").val()) {
        var year = reportYear;
        var name = reportName + " - " + year;
      } else {
        var year = $("#research-year-input").val();
        var name = $("#report-name-input").val() + " - " + year;
      }

      $("#research-name-input").val(name);
    };

    $('.send-button').on('click', function() {
      App.views.functions.setPresentDate();
      fillResearchInputs();

      if ( isValidForm() ) {
        postQuery('r');
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports, function(r) {
            return {'label': `${r.name} (${r.year})`, 'id': r.id, 'year': r.year, 'name': r.name}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          reportName = ui.item.name;
          reportYear = ui.item.year;
          $("#report-input-id").val(ui.item.id);
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

    let lastSelectedAuthorId = 0;
    let lastSelectedAuthorName = '';
    $('#author-input').on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $('.find-author').on('autocompleteselect', '#author-input', function(event, ui) {
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

    $('.find-report').on('autocompleteselect', '#report-input', function(event, ui) {
      if (ui.item.value === 'Ничего не найдено. Добавить?') {
        let $input = $(this);
        let id = $input.attr('id');
        let inputValue = $input.val();

        let tmpl = _.template( $('.add-report').html() );

        $input.parent().html( tmpl() );
        

        $('#' + addName(id)).val(inputValue);
        
        setSelectsEvents();
      }
    });

    $('.find-report').on('autocompleteselect', '#report-city-input', function(event, ui) {
      citySelectHandler(event, ui);
    });


    // События для прослушивания размера файлов
    var checkFileSize = App.fn.checkFileSize;
    var $authorPhoto = $('#author-photo-input');
    $authorPhoto.change(checkFileSize.bind($authorPhoto, 10));

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

    // Валидация полей с автокомплитом
    // var validate = App.fn.validInput;
    // validate('author-input', lastSelectedAuthorName);
    // validate('report-input', reportName);
    // validate('report-city-input', lastSelectedCityName);
    // validate('report-organization-input', orgName);

    let aId = 1;

    $('.btn-new-coauthor').on('click', function(e) {
      let localAuthorId = aId++;

      App.views.functions.setAuthorAutocomplete($(this), localAuthorId);
    })

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      let localMonId = monId++;
      let localMonX, localMonY;
      App.template.get("research/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl({'monId': localMonId, 'needHeader': true}));

        App.views.functions.setAccordionHeader($(`#monument-header-${localMonId}`));

        $(`#monument-name-input-${localMonId}`).on("change", function() {
          let monName = $(this).val();
          $(`.mon-name-${localMonId}`).text(`${monName}: `)
        })

        _.each($(".exc-belongs"), function(obj, key) {
          let monName = "Без названия";
          let excId = $(obj).attr("data-exc-id");
          let monLayers = App.views.functions.addMonRelation("exc", "m", localMonId, monName);
          let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, localMonId);
          monLayers.append(checkbox);
          $(obj).append(monLayers);
        })

        $(`#monument-input-${localMonId}`).autocomplete({
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

        $(`#monument-input-${localMonId}`).on('autocompletefocus', function(event, ui) {
          event.preventDefault();
        });

        let lastSelectedMonId = 0;
        let monSelName = '';
        $(`#monument-input-${localMonId}`).on('autocompleteselect', function(event, ui) {
          if (ui.item.value === 'Ничего не найдено. Добавить?') {
            let $input = $(this);
            let id = $input.attr('id');
            let inputValue = $input.val();

            let tmpl = _.template( $(`script.add-monument-${localMonId}`).html() );
            $(`.find-monument-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            tmpl = _.template( $(`script#add-layer-${localMonId}`).html() );
            $(`#place-for-layers-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            $('#' + addName(id)).val(inputValue);

            $($(`#monument-new-coords-${localMonId}`)[0]).show().find("input, select").attr("used", true);
            $(`#monument-new-coords-button-${localMonId}`).remove();
            monumentResShowNew(localMonId);

            let layerCounter = App.fn.counter(1);
            let layerCounter2 = App.fn.counter(1);

            let monLayers = $(`.mon-checkboxes-${localMonId}`);
            monLayers.find("input").remove();
            $(`#monument-name-input-${localMonId}`).trigger("change");

            let $button = $(`#add-layer-button-${localMonId}`);
            $button.on("click", () => App.views.functions.addLayer($button, localMonId, layerCounter()));
            $button.on("click", () => {
              let layerId = layerCounter2();
              _.each(monLayers, function(layers, excId) {
                let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, localMonId, layerId);
                $(layers).append(checkbox);
              })
            });
            $button.trigger("click");

            getDataForSelector($(`#mon-type-selector-${localMonId}`), "MonumentType");
          } else if (lastSelectedAuthorId != ui.item.id) {
            if (ui.item.inThisRes) {
              monumentResHide(localMonId);
              $(`#knowledge-id-${monId}`).val(ui.item.kId);
            } else {
              monumentResShow(localMonId);
              $(`#knowledge-id-${monId}`).val("");
            }

            lastSelectedMonId = ui.item.id;
            $(`#monument-input-id-${localMonId}`).val(lastSelectedMonId);
            monSelName = ui.item.name;
            
            $($("#clarify-button-"+localMonId)[0]).show();

            let coords = App.models.Monument.getActualSpatref(ui.item.id);
            $.when(coords).then(function(coord) {
              localMonX = coord.x;
              localMonY = coord.y;
              $.when(App.models.Monument.findMonsByCoords(localMonX, localMonY)).then(monIds => {
                let mainMonId = [];
                mainMonId.push($(`#monument-input-id-${localMonId}`).val());
                monIds = _.extend(mainMonId, monIds).join(",");
                $(`#monument-clarify-input-id-${localMonId}`).val(monIds);
              })

              $(`#spatref-y-${localMonId}`).text(coord.y);
              $(`#spatref-x-${localMonId}`).text(coord.x);
              $(`#spatref-type-${localMonId}`).text(coord.typeName);
            })
          }
        });
        
        coordpicker($('#coord-picker-'+localMonId), {
          inputs: ['#monument-x-'+localMonId, '#monument-y-'+localMonId],
          map: map
        }, localMonId);
        getDataForSelector($("#spatref-selector-"+localMonId), "SpatialReferenceType");

        $("#clarify-button-"+localMonId).on("click", function() {
          $($(`#monument-new-coords-${localMonId}`)[0]).show().find("input, select").attr("used", true);
          $(`#monument-new-coords-button-${localMonId}`).remove();
        })
        
        App.views.functions.setCultureAutocomplete($(`#culture-input-${localMonId}`), localMonId);
      })

      setSelectsEvents();
    });

    let excCounter = App.fn.counter(1);
    $("#add-exc-button").on('click', function(e) {
      let excId = excCounter();

      $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
        _.each($(".monument-content"), function(obj, monId) {
          let monName = $(obj).find(".monument-name").val() || "Без названия";
          let layers = $(obj).find(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", "m", monId+1, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId+1, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId+1)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    });

    $("#container").tabs();
  },

  "new_by_pub": function() {
    let coordpicker = App.blocks.coordpicker;
    let fmt = App.fn.fmt;
    let excludeIdent = App.fn.excludeIdentMonuments;
    let addName = App.fn.addNameToId;
    let repSelName = '';
    let objectId = "m_1";
    
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

    let aId = 1;

    $('.btn-new-coauthor').on('click', function(e) {
      let localAuthorId = aId++;

      App.views.functions.setAuthorAutocomplete($(this), localAuthorId);
    })
    
    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      let localMonId = monId++;
      let localMonY, localMonX;
      App.template.get("research/addMonument", function(tmpl) {
        $('#add-monument-button').before(tmpl({'monId': localMonId, 'needHeader': true}));

        App.views.functions.setAccordionHeader($(`#monument-header-${localMonId}`));

        $(`#monument-name-input-${localMonId}`).on("change", function() {
          let monName = $(this).val();
          $(`.mon-name-${localMonId}`).text(`${monName}: `)
        })

        _.each($(".exc-belongs"), function(obj, key) {
          let monName = "Без названия";
          let excId = $(obj).attr("data-exc-id");
          let monLayers = App.views.functions.addMonRelation("exc", "m", localMonId, monName);
          let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, localMonId);
          monLayers.append(checkbox);
          $(obj).append(monLayers);
        })

        $(`#monument-input-${localMonId}`).autocomplete({
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

        $(`#monument-input-${localMonId}`).on('autocompletefocus', function(event, ui) {
          event.preventDefault();
        });

        let lastSelectedMonId = 0;
        let monSelName = '';
        $(`#monument-input-${localMonId}`).on('autocompleteselect', function(event, ui) {
          if (ui.item.value === 'Ничего не найдено. Добавить?') {
            let $input = $(this);
            let id = $input.attr('id');
            let inputValue = $input.val();

            let tmpl = _.template( $(`script.add-monument-${localMonId}`).html() );
            $(`.find-monument-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            tmpl = _.template( $(`script#add-layer-${localMonId}`).html() );
            $(`#place-for-layers-${localMonId}`).replaceWith( tmpl({'monId': localMonId}) );

            $('#' + addName(id)).val(inputValue);

            $($(`#monument-new-coords-${localMonId}`)[0]).show().find("input, select").attr("used", true);
            $(`#monument-new-coords-button-${localMonId}`).remove();
            monumentResShowNew(localMonId);

            let layerCounter = App.fn.counter(1);
            let layerCounter2 = App.fn.counter(1);

            let monLayers = $(`.mon-checkboxes-${localMonId}`);
            monLayers.find("input").remove();
            $(`#monument-name-input-${localMonId}`).trigger("change");

            let $button = $(`#add-layer-button-${localMonId}`);
            $button.on("click", () => App.views.functions.addLayer($button, localMonId, layerCounter()));
            $button.on("click", () => {
              let layerId = layerCounter2();
              _.each(monLayers, function(layers, excId) {
                let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId+1, localMonId, layerId);
                $(layers).append(checkbox);
              })
            });
            $button.trigger("click");

            getDataForSelector($(`#mon-type-selector-${localMonId}`), "MonumentType");
          } else if (lastSelectedAuthorId != ui.item.id) {
            if (ui.item.inThisRes) {
              monumentResHide(localMonId);
              $(`#knowledge-id-${monId}`).val(ui.item.kId);
            } else {
              monumentResShow(localMonId);
              $(`#knowledge-id-${monId}`).val("");
            }

            lastSelectedMonId = ui.item.id;
            $(`#monument-input-id-${localMonId}`).val(lastSelectedMonId);
            monSelName = ui.item.name;
          
            $($("#clarify-button-"+localMonId)[0]).show();

            let coords = App.models.Monument.getActualSpatref(ui.item.id);
            $.when(coords).then(function(coord) {
              localMonX = coord.x;
              localMonY = coord.y;
              $.when(App.models.Monument.findMonsByCoords(localMonX, localMonY)).then(monIds => {
                let mainMonId = [];
                mainMonId.push($(`#monument-input-id-${localMonId}`).val());
                monIds = _.extend(mainMonId, monIds).join(",");
                $(`#monument-clarify-input-id-${localMonId}`).val(monIds);
              })

              $(`#spatref-y-${localMonId}`).text(coord.y);
              $(`#spatref-x-${localMonId}`).text(coord.x);
              $(`#spatref-type-${localMonId}`).text(coord.typeName);
            })
          }
        });

        coordpicker($('#coord-picker-'+localMonId), {
          inputs: ['#monument-x-'+localMonId, '#monument-y-'+localMonId],
          map: map
        }, localMonId);
        getDataForSelector($("#spatref-selector-"+localMonId), "SpatialReferenceType");

        $("#clarify-button-"+localMonId).on("click", function() {
          $($(`#monument-new-coords-${localMonId}`)[0]).show().find("input, select").attr("used", true);
          $(`#monument-new-coords-button-${localMonId}`).remove();
        })
        
        App.views.functions.setCultureAutocomplete($(`#culture-input-${localMonId}`), localMonId);
      })

      setSelectsEvents();
    });
    
    let excCounter = App.fn.counter(1);
    $("#add-exc-button").on('click', function(e) {
      let excId = excCounter();

      $.when(App.views.functions.addExcavation($(this), excId, map)).then(function(response) {
        _.each($(".monument-content"), function(obj, monId) {
          let monName = $(obj).find(".monument-name").val() || "Без названия";
          let layers = $(obj).find(".mon-layer");
          let monLayers = App.views.functions.addMonRelation("exc", "m", monId+1, monName);

          if (layers.length > 0) {
            _.each(layers, function(layer, layerId) {
              let checkbox = App.views.functions.addLayerCheckbox("exc", "m", excId, monId+1, layerId+1)
              monLayers.append(checkbox);
            })
          } else {
            let checkbox = App.views.functions.addRelationCheckbox("exc", "m", excId, monId+1)
            monLayers.append(checkbox);
          }

          $(`#exc-belongs-${excId}`).append(monLayers)
        })   
      });
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
        postQuery("rs");
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });
  },

  "getFullResearchTitle": function(authorName, resYear, resType) {
    return [
      (authorName || "Неизвестный автор"),
      (resType || "без типа"),
      (resYear || "год не указан")
    ].join(", ");
  }
}));
