'use strict';

App.blockMaker = new function() {
  // Блоки для инициализации.
  var initializers = [];

  var lastId = 0;

  this.createBlock = function(blockName, params, id) {
    if (App.blocks[blockName]) {
      var id = id || 'block--' + lastId++;
      
      initializers.push(function() {
        var $block = $('#' + id);
        App.blocks[blockName]($block, params)
        App.page.registerObject(id, $block);
      });
      
      return '<div id="' + id + '">';
    } else {
      throw 'unknown block: ' + blockName;
    }
  };

  this.runInitializers = function() {
    _.invoke(initializers, 'call');
    initializers = [];
  };
};
