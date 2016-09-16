"use strict";

(function() {
  function Monument(id) {
    App.node.Base.call(this, id, Monument);
  }

  Monument.actions = {
    "add": []
  };

  Monument.schema = {};
  
  App.node.Monument = Monument;
}());