'use strict';

App.fn.fmt = function(pattern, object) {
  return pattern.replace(/\$(\w+)/g, function(unused, word) {
    return object[word] || word;
  });
};
