"use strict";

App.models.Heritage = function Heritage() {
  var props = {};
  App.models.proto.call(this, App.models.Heritage.scheme, props);
};

App.models.Heritage.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/okns', {'needle': name, 'limit': 10});

    $.get({
      url,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => resolve($.parseJSON(response)),
      error: reject
    });
  });
};

App.models.Heritage.url = function(id) {
  return id ? '#heritage/show/' + id : '#heritage/show';
};

App.models.Heritage.href = function(id, text) {
  return '<a href="' + App.models.Heritage.url(id) + '">' + text + '</a>';
};


App.models.Heritage.scheme = App.models.proto.parseScheme("Heritage", {
  "name": {
    "type": "text",
    "validations": []
  }
});