"use strict";

(function() {  
  function Knowledge(key) {
    App.models.base.call(this, key, Knowledge.scheme);
  }
  
  Knowledge.scheme = {
    "name": {"type": "text"},
    "description": {"type": "text"}
  };

  Knowledge.presentation = {
    "name": {
      "t": "Knowledge.prop.name"
    },
    "description": {
      "t": "Knowledge.prop.description",
      "input": "textarea"
    }
  };

  App.models.Knowledge = Knowledge;
}());
