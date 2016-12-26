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


App.models.Excavation.scheme = App.models.proto.parseScheme("Excavation", {
  "name": {
    "type": "text",
    "validations": []
  }
});