'use strict';

App.url = new function() {
  var params = [];
  var mapping = {};

  this.bindParams = function(paramsToBind) {
    params = paramsToBind;
    mapping = {};
  };

  this.setMapping = function(mappingToSet) {
    console.log("map", mappingToSet)
    mapping = _.invert(mappingToSet);
  };
  
  this.get = function(key) {
    return params[mapping[key]];
  };

  this.make = function(location, params) {
    return location + '?' + _.map(params, (val, key) => key + '=' + val).join('&');
  };
};
