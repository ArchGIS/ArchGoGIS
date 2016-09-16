"use strict";

App.models.base = function(key, scheme) {
  if (!key) {
    throw "model `key` must be passed in the constructor";
  }
  var t = App.locale.translate;

  var inputs = {};
  var props = {};

  this.input = (propName) => {
    var type = this.constructor.name;
    var id = `${key}-${type}-${propName}`;
    var text = t(`${type}.prop.${propName}`);
    
    if ("enum" == scheme[propName].type) {
      inputs[propName] = {
        "id": "#" + id.replace(".", "\\."),
        "type": "select"
      };

      App.page.on("afterRender", function() {
        var epochs = t(`enums.${propName}`);
        $(inputs[propName].id).html(
          _.map(epochs, (name, id) => `<option value=${id+1}>${name}</option>`).join("")
        );
      });
      
      return `<label>${text}<select id="${id}"></select></label>`;
    } else {
      inputs[propName] = {
        "id": "#" + id.replace(".", "\\."),
        "type": "text"
      };
      return `<label>${text}<input id="${id}"></label>`;
    }
  };

  this.set = (propName, value) => {
    if (scheme[propName]) {
      props[propName] = value;
    } else {
      throw `scheme does not contain '${propName}' key`;
    }
  };

  this.get = (propName) => {
    if (props[propName]) {
      return props[propName];
    } else if (inputs[propName]) {
      var input = inputs[propName];
      if ("text" == input.type) {
        return $(input.id).val();
      } 
    }
    
    return undefined;
  };

  this.hqueryData = () => {
    var tag = key + ":Knowledge";
    var data = {};
    data[tag] = {};
    
    _.each(scheme, (info, propName) => {
      var propTag = propName + "/" + info.type;
      data[tag][propTag] = this.get(propName);
    });
    
    return data;
  };
};
