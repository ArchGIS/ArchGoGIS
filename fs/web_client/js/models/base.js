"use strict";

App.models.base = function(scheme) {
  var t = App.locale.translate;
  
  var props = {};
  
  this.set = (propName, value) => {
    if (scheme[propName]) {
      props[propName] = value;
    } else {
      throw `scheme does not contain '${propName}' key`;
    }
  };

  this.get = (propName) => props[propName];

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
