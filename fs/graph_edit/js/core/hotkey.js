"use strict";

(function() {
  var bindings = {};

  function bindKeyUp(keyCode, callback) {
    bindings[keyCode] = {
      "withoutCtrl": true,
      "fn": callback
    };
  }

  function bindCtrlKeyUp(keyCode, callback) {
    bindings[keyCode] = {
      "withoutCtrl": false,
      "fn": callback
    };
  }

  $(window).keyup(function(event) {
    var binding = bindings[event.which];
    
    if (binding) {
      if (binding.withoutCtrl) {
        binding.fn(event);
      } else if (event.ctrlKey) {
        binding.fn(event);
      }
    }
  });
  
  App.hotkey = {
    "bind": bindKeyUp,
    "bindCtrl": bindCtrlKeyUp,
  };
}());
