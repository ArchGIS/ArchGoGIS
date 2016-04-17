"use strict";


App.models.Organization = function Organization() {
  var props = {};
  App.models.proto.call(this, App.models.Organization.scheme, props);

  
};

App.models.Organization.scheme =
  App.models.proto.parseScheme("organization", {
    "name": {
      "type": "text",
      "validations": []
    }
  });
