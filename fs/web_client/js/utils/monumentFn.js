'use strict';

App.utils.monumentFn = {
  "chooseMonumentName": function(names) {
    let tmpNames = {}, max = 0, bestName;

    _.each(names, function(name, id) {
      (tmpNames[name]) ? tmpNames[name]++ : tmpNames[name] = 1;

      if (tmpNames[name] > max) {
        max = tmpNames[name];
        bestName = name;
      }
    })
    
    return bestName;
  }
};

App.utils.isNotExistID = (arr, property, value) => {
  return _.isUndefined(_.find(arr, val => val[property] === value));
};