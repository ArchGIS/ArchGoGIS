"use strict";

App.models.Monument = function Monument() {
  var props = {};
  App.models.proto.call(this, App.models.Monument.scheme, props);
};

App.models.Monument.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/filter_monuments', {
      'name': name,
      'epoch': ''
    });

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

App.models.Monument.scheme = App.models.proto.parseScheme("monument", {
  "x": {
    "type": "number",
    "validations": []
  },
  "y": {
    "type": "number",
    "validations": []
  },
  "epoch": {
    "type": "text",
    "validations": []
  }
});
