"use strict";

(function() {
  function Excavations(id) {
    App.node.Base.call(this, id, Excavations);
  }

  Excavations.actions = {
    "add": []
  };

  Excavations.schema = {};
  
  App.node.Excavations = Excavations;
}());