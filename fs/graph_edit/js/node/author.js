"use strict";

(function() {
  function Author(id) {
    App.node.Base.call(this, id, Author);
  }

  Author.actions = {
    "add": [
      "Research"
    ]
  };

  Author.schema = {
    "name": {
      "type": T_STRING,
      "key": true
    }
  };
  
  App.node.Author = Author;
}());