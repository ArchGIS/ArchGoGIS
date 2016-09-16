"use strict";

(function() {
  function CoAuthor(id) {
    App.node.Base.call(this, id, CoAuthor);
  }

  CoAuthor.actions = {
    "add": []
  };

  CoAuthor.schema = {};
  
  App.node.CoAuthor = CoAuthor;
}());