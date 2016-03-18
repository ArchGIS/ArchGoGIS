'use strict';

App.url = new function() {
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

  this.make = function(location, params) {
    return location + '?' + _.map(params, (val, key) => key + '=' + val).join('&');
  }
};
