"use strict";

App.models.base = function(key, scheme) {
  if (!key) {
    throw "model `key` must be passed in the constructor";
  }
  var t = App.locale.translate;

  var inputs = {};
  var props = {};

  this.input = (propName) => {
    var id = key + "-knowledge-" + propName;
    var text = t(`knowledge.prop.${propName}`);
    inputs[propName] = {
      "id": "#" + id.replace(".", "\\."),
      "type": "text"
    };
    
    return `<label>${text}<input id="${id}"></label>`;
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
