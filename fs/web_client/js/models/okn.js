"use strict";

App.models.Okn = function Okn() {
  var props = {};
  App.models.proto.call(this, App.models.Okn.scheme, props);
};

App.models.Okn.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/okns', {'needle': name, 'limit': 10});

    $.get(url)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
};


App.models.Okn.scheme = App.models.proto.parseScheme("Okn", {
  "name": {
    "type": "text",
    "validations": []
  }
});