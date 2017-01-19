"use strict";

App.models.artiCategory = function artiCategory() {
  var props = {};
  App.models.proto.call(this, App.models.artiCategory.scheme, props);
};

App.models.artiCategory.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    var url = App.url.make('/search/cities', {'needle': name, 'limit': 10});

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

App.models.artiCategory.getAll = function() {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      "rows:ArtifactCategory": {"id": "*", "select": "*"},
    })

    $.post({
      url: "/hquery/read",
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: function(response) {
        response = JSON.parse(response);
        console.log(response)
        resolve(response)
      }
    });
  });
};

App.models.artiCategory.scheme = App.models.proto.parseScheme("artiCategory", {
  "name": {
    "type": "text",
    "validations": []
  }
});