"use strict";

App.models.Publication = function Publication() {
  var props = {};
};

App.models.Publication.url = function(id) {
  return id ? '#Publication/show/' + id : '#publication/show';
};

App.models.Publication.href = function(id, text) {
  return '<a href="' + App.models.Publication.url(id) + '">' + text + '</a>';
};