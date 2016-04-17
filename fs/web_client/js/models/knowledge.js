"use strict";

App.models.Knowledge = function Knowledge() {
  var props = {};
  App.models.proto.call(this, App.models.Knowledge.scheme, props);

  this.describes = function() {
    // return new App.models.Knowledge.Describes(
  };
};

App.models.Knowledge.scheme =
  App.models.proto.parseScheme("knowledge", {
    "name": {
      "type": "text",
      "validations": []
    }
  });

App.models.Knowledge.Describes = function Describes() {
  var props = {};
  App.models.proto.call(this, App.models.Knowledge.Describes.scheme, props);
};

App.models.Knowledge.Describes.scheme =
  App.models.proto.parseScheme("knowledge.describes", {
    "test": {
      "type": "text",
      "validations": []
    }
  });
