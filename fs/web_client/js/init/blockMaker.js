'use strict';

App.blockMaker = new function() {
  // Блоки для инициализации.
  var initializers = [];

  this.createBlock = function(blockName, id, params) {
    if (!id) {
      throw 'no id for ' + blockName + ' block given';
    }
    
    if (App.blocks[blockName]) {
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
