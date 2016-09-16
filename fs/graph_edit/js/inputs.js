"use strict";

var INP_TEXT = 0;
var INP_STRING = 1;

(function() {
  var t = App.locale.translate;

  function NodeInputStatus(key) {
    var $status = $(`#node-${key}-status`);

    this.setNormalStatus = $status.hide;    

    this.setErrorStatus = (hint) => {
      $status.
        show(). 
        removeClass("status-ok").
        addClass("status-error").
        prop("title", hint);
    };

    this.setOkStatus = () => {
      $status.
        show().
        removeClass("status-error").
        addClass("status-ok").
        prop("title", "");
    };
  }

  App.inputs = {
    "InputStatus": NodeInputStatus
  };
}())
