'use strict';

App.models.Author = function Author(key) {
  var props = {};
  App.models.proto.call(this, key, App.models.Author.scheme, props);
}

App.models.Author.scheme =
  App.models.proto.parseScheme("author", {
    "name": {
      "type": "text",
      "validations": []
    },
    "year": {
      "type": "number",
      "validations": []
    }
  });

App.models.Author.findByNamePrefix = function(name) {
  return new Promise(function(resolve, reject) {
    // #FIXME: нужно вызывать ошибку при слишком
    // длинном name префиксе.
    var url = App.url.make('/search/authors', {'needle': name, 'limit': 10});
    
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

App.models.Author.url = function(id) {
  return id ? '#author/show/' + id : '#author/show';
};

App.models.Author.href = function(id, text) {
  return '<a href="' + App.models.Author.url(id) + '">' + text + '</a>';
};
App.models.Author.findByLastNamePrefix = function(name) {
  console.log(name)
  var lastName = name.split(/,\s*/).pop();
  return App.models.Author.findByNamePrefix(lastName);
};
