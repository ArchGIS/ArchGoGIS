'use strict';

App.views.functions = {
  "setAccordion": function(accordionSelector) {
    var headers = $(accordionSelector + ' .accordion-header');

    headers.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  },

  "setAccordionHeader": function(header) {
    header.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  },

  "getMonImageCard": (params) => {
    let imagesHtml = '';

    let tmpl = _.template(`
      <div class="media">
        <a class="pull-left" href="<%= HOST_URL %>/local_storage/<%= fileid %>" target="_blank">
          <img class="media-object" src="<%= HOST_URL %>/local_storage/<%= fileid %>" width="300" alt="Фотография памятника">
        </a>
        <div class="media-body">
          <p>Элемент памятника: <%= monumentPart %></p>
          <p>Ракурс: <%= direction %></p>
        </div>
      </div>
    `);

    _.times(params.photo.length, (i) => {
      imagesHtml += tmpl({
        fileid: params.photo[i].fileid,
        monumentPart: params.photo[i].monumentPart || 'Не задано',
        direction: params.cd[i].name
      });
    });

    if (params.photo.length === 0) {
      imagesHtml += 'Нет фотографий';
    }

    return imagesHtml;
  },

  "getTopoCard": (topos) => {
    let imagesHtml = '';

    let tmpl = _.template(`
      <div class="media">
        <a class="pull-left" href="<%= HOST_URL %>/local_storage/<%= fileid %>" target="_blank">
          <img class="media-object" src="<%= HOST_URL %>/local_storage/<%= fileid %>" width="300" alt="Card image cap">
        </a>
        <div class="media-body">
          <p>Автор: <%= author %></p>
          <p>Год съёмки: <%= year %></p>
        </div>
      </div>
    `);

    _.times(topos.length, (i) => {
      imagesHtml += tmpl({
        fileid: topos[i].fileid,
        year: topos[i].year || 'Не задано',
        author: topos[i].author || 'Неизвестен'
      });
    });

    if (topos.length === 0) {
      imagesHtml += 'Нет топопланов';
    }

    return imagesHtml;
  },

  "setCultureAutocomplete": function(field, monId) {
    let d_cultures = App.models.Culture.getAll();
    let grepObject = App.fn.grepObject;

    $.when(d_cultures).done((cultures) => {
      let items = _.map(cultures, culture => ({'id': culture.id, 'label': culture.name}));

      $(field).autocomplete({
        source: function(req, res) {
          let term = req.term.toLowerCase();
          
          res(grepObject(term, items, 'label'));
        },
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    });

    $(field).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $(field).on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0) {
        ui.content.push({
          'value': 0,
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });
    
    $(field).on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 0) {
        // let id = field.selector;
        // let inputValue = field.val();

        App.template.get("culture/create", function(tmpl) {
          $(field).parent().replaceWith(tmpl({'monId': monId}));
        });
      } else {
        $(field.selector + '-id').val(ui.item.id);
      }
    });
  },

  "addLayer": function(button, monId, layerId) {
    let setAccordionHeader = this.setAccordionHeader;

    App.template.get("monument/layer", function(tmpl) {
      button.before(tmpl({'monId': monId, 'layerId': layerId}));

      console.log($(`#layer-header-${monId}.${layerId}`))
      setAccordionHeader($(`#layer-header-${monId}.${layerId}`));
    })
  }
}