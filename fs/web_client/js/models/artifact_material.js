"use strict";

App.models.artiMaterial = function artiMaterial() {
  var props = {};
  App.models.proto.call(this, App.models.artiMaterial.scheme, props);
};

App.models.artiMaterial.findByNamePrefix = function(name) {
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

App.models.artiMaterial.getAll = function() {
  return new Promise(function(resolve, reject) {
    var query = JSON.stringify({
      "rows:ArtifactMaterial": {"id": "*", "select": "*"},
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

App.models.artiMaterial.scheme = App.models.proto.parseScheme("artiMaterial", {
  "name": {
    "type": "text",
    "validations": []
  }
});