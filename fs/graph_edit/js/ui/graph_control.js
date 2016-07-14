"use strict";

$(function() {
  var t = App.locale.translate;

  $("#zoom-in").on("click", App.graph.zoomIn);
  $("#zoom-out").on("click", App.graph.zoomOut);

  var $layoutSelector = $("#graph-layout-selector");
  var $applyLayout = $("#apply-graph-layout");

  function init(enabledLayouts) {
    var optionTmpl = (layoutName) => (`
      <option value="${layoutName}">
        ${t(`graphControl.layoutNames.${layoutName}`)}
      </option>
    `);

    $layoutSelector.html(_.map(enabledLayouts, optionTmpl));
  }

  $applyLayout.on("click", function() {
    App.graph.setLayout($layoutSelector.find(":selected").val());    
  });

  App.graphControl = {
    "init": init
  };
});