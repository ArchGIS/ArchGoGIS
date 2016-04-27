"use strict";

(function() {
  function Collection(key) {
    App.models.base.call(this, key, Collection.scheme);
  }

  Collection.scheme = {};

  App.models.Collection = Collection;
}());
