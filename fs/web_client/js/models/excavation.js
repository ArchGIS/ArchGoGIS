"use strict";

App.models.Excavation = function Excavation() {
  var props = {};
  App.models.proto.call(this, App.models.Excavation.scheme, props);
};

App.models.Excavation.url = function(id) {
  return id ? '#excavation/show/' + id : '#excavation/show';
};

App.models.Excavation.href = function(id, text) {
  return '<a href="' + App.models.Excavation.url(id) + '">' + text + '</a>';
};

App.models.Excavation.findByNamePrefix = function(name, resId, authorId, year) {
  return new Promise(function(resolve, reject) {
    resId = resId || '';
    year = year || '';
    authorId = authorId || '';
    var url = App.url.make('/search/filter_excavations', {
      'authorid': authorId,
      'year': year,
      'resid': resId,
    });

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

App.models.Excavation.scheme = App.models.proto.parseScheme("Excavation", {
  "name": {
    "type": "text",
    "validations": []
  }
});