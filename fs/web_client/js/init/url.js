'use strict';

App.Url = new function() {
  var params = {};
  
  this.parse = function(query) {
    query = query.substring(1);

    params = {};
    _.each(query.split("&"), function(keyValString) {
      var keyVal = keyValString.split("=");
      params[keyVal[0]] = keyVal[1];
    });
  };
  
  this.get = function(key) {
    return params[key];
  };
};
