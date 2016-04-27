"use strict";

(function() {
  function Knowledge(key) {
    App.models.base.call(this, key, Knowledge.scheme);
  }
  
  Knowledge.scheme = {
    "name": {"type": "text"},
    "ArchMap.n": {"type": "text"},
    "ArchMap.page": {"type": "number"}
  };

  App.models.Knowledge = Knowledge;
}());
