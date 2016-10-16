"use strict";

App.models.City = function City() {
  var props = {};
  App.models.proto.call(this, App.models.City.scheme, props);
};

App.models.City.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/cities', {'needle': name, 'limit': 10});

    $.get(url)
      .success(response => resolve($.parseJSON(response)))
      .error(reject);
  });
};


App.models.City.scheme = App.models.proto.parseScheme("City", {
  "name": {
    "type": "text",
    "validations": []
  }
});