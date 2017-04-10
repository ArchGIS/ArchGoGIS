'use strict';

App.models.Radiocarbon = function() {};

App.models.Radiocarbon.url = function(id) {
  return id ? '#radiocarbon/show/' + id : '#radiocarbon/show';
};

App.models.Radiocarbon.href = function(id, text) {
  return '<a href="' + App.models.Radiocarbon.url(id) + '">' + text + '</a>';
};
