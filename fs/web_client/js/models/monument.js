"use strict";

(function() {
  function Monument(key) {
    App.models.base.call(this, key, Monument.scheme);
  }

  Monument.scheme = {
    "epoch": {"type": "enum"},
    "x": {"type": "number"},
    "y": {"type": "number"}
  };

  App.models.Monument = Monument;
}());

App.models.Monument.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/monuments', {'needle': name, 'limit': 10});

    $.get(url)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
};

App.models.Monument.url = function(id) {
  return id ? '#monument/show/' + id : '#monument/show';
};

App.models.Monument.href = function(id, text) {
  return '<a href="' + App.models.Monument.url(id) + '">' + text + '</a>';
};
