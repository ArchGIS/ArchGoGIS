"use strict";

function Select(id) {
  var $el = null;

  App.page.on("afterRender", () => {
    $el = $("#" + id.replace(".", "\\."));
  });
  
  this.get = () => $el.find(":selected").val();
  this.set = (index) => $el.val(index);
  this.fill = (values) => {
    $el.html(
      _.map(values, (value, index) => {
        return `<option value=${index+1}>${value}</option>`;
      }).join("")
    );
  };
}

function Input(id) {
  var $el = null;
  
  App.page.on("afterRender", () => $el = $("#" + id.replace(".", "\\.")));

  this.get = () => $el.val();
  this.set = (value) => $el.val(value);
}

function ModelGroup(model, key) {
  var t = App.locale.translate;

  var $list = null;
  var activeItemKey = 0;
  var items = [{"model": model, "$ref": null}];
  var inputs = {};
  var scheme = App.models[model.constructor.name].scheme;
  var presentation = App.models[model.constructor.name].presentation;

  var listRef = (modelKey, isActive) => {
    return $("<span/>", {
      "css": {"font-weight": isActive ? "bold" : "normal"},
      "text": " [" + modelKey + "] ",
      "class": "ui-button",
    }).on("click", () => activate(modelKey - 1));
  };
  
  var activate = (modelKey) => {
    if (activeItemKey == modelKey) {
      return;
    }

    items[activeItemKey].$ref.css("font-weight", "normal");
    items[modelKey].$ref.css("font-weight", "bold");
    
    // Сначала сохраняем поля в предыдущую модель.
    var model = items[activeItemKey].model;
    _.each(inputs, (input, propName) => {
      model.set(propName, input.get());
    });

    // Затем заполняем input'ы данными из выбранной модели.
    model = items[modelKey].model;
    _.each(inputs, (input, propName) => {
      input.set(model.get(propName));
    });
    
    activeItemKey = modelKey;
  };
  
  var pushItem = () => {
    var $ref = listRef(items.length + 1, false);
    $list.append($ref);

    items.push({
      "model": new model.constructor(),
      "$ref": $ref
    });
    
    activate(items.length - 1);
  };

  var popItem = () => {
    if (items.length < 2) { return; }
    if (items.length - 1 == activeItemKey) {
      // Если удаляемый item - текущий, то делаем текущим предпоследний item.
      activate(items.length - 2); 
    }

    var item = items.pop();
    item.$ref.empty();
  };

  this.list = () => {
    var id = `${key}-${model.constructor.name}-list`;

    App.page.on("afterRender", () => {
      $list = $("#" + id);
      $list.append($('<i/>', {
        "class": "paginator-next fa fa-plus-square ui-button",
        "click": pushItem
      }));
      $list.append($("<i/>", {
        "class": "paginator-next fa fa-minus-square ui-button",
        "click": popItem
      }));
      items[0].$ref = listRef(1, true);
      $list.append(items[0].$ref);
    });

    var text = t(`${model.constructor.name}.plural`);
    return `${text}: <span id="${id}"></span>`;
  };

  this.finder = () => {
    var id = `${key}-${model.constructor.name}-finder`;
    var text = t(`${model.constructor.name}.singular`);
    App.page.on("afterRender", () => {
      var $finder = $("#" + id);
      var lastTerm = "";
      var items = [];
      
      $finder.autocomplete({
        "minLength": 4,
        "source": (request, response) => {
          var term = request.term;
          if (term != lastTerm) {
            model.finder(term).then(
              result => {
                items = result;
                response(items);
              }
            );
          } else {
            response(grepObject("^" + term, items, "label"));
          }
        }
      });
      $finder.on("focus", () => { $finder.autocomplete("search"); });
    });
    return `<div class="field-input"><label><input id="${id}">${text}</label></div>`;
  };
  
  this.input = (propName) => {
    var id = `${key}-${model.constructor.name}-${propName}`;
    var text = t(presentation[propName].t);

    var propInfo = scheme[propName];
    if (!propInfo) {
      throw `prop ${propName} not found in ${model.constructor.name} scheme`;
    }
    
    if ("enum" == scheme[propName].type) {
      inputs[propName] = new Select(id);
      App.page.on("afterRender", function() {
        inputs[propName].fill(t(`enums.${propName}`));
      });
      return `<div class="field-input"><label><select id="${id}"></select>${text}</label></div>`;
    } else {
      inputs[propName] = new Input(id);
      if ("textarea" == presentation[propName].input) {
        return `<div class="field-input"><label><textarea id="${id}"></textarea>${text}</label></div>`;
      } else {
        return `<div class="field-input"><label><input id="${id}">${text}</label></div>`;
      }
    }
  };
}

App.Form = function Form(models) {
  var t = App.locale.translate;
  
  var groups = _.mapObject(models, function(model, groupKey) {
    return new ModelGroup(model, groupKey);
  });
  
  var findGroup = (groupKey) => {
    var group = groups[groupKey];
    if (!group) {
      throw `group ${groupKey} not found`;
    }
    return group;
  };

  this.list = (groupKey) => findGroup(groupKey).list();
  
  this.finder = (groupKey) => findGroup(groupKey).finder();
  
  this.input = (groupKey, propName) => findGroup(groupKey).input(propName);
};
