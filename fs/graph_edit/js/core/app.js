"use strict";

$(function() {
  var enabledTabs = [
    "graphControl",
    "mapControl",
    "nodeControl",
  ];

  /*
   * Инициализация основного UI. 
   */

  $("#data-tab").tabs();
  
  App.toolbox.init({
    "enabledTabs": enabledTabs,
    "enabledGraphLayouts": [
      "grid",
      "tree",
      "spread",
    ]
  });

  /*
   * Инициализация горячих клавиш.
   */

  App.hotkey.bind(KeyEvent.DOM_VK_DELETE, App.graph.deleteSelected);

  for (var i in enabledTabs) {
    App.hotkey.bindCtrl(
      KeyEvent[`DOM_VK_${+i + 1}`],
      (event) => App.toolbox.setTab(event.which - i.charCodeAt(0) + 1)
    );
  }

  /*
   * Инициализация cytoscape и всего остального, связанного с графом.
   */

  (function() {
    var author = new App.node.Author("author");
    var research = new App.node.Research("research");

    App.graph.init([author, research]);
    App.graph.connectNodes(author, research);

    App.graph.setLayout("tree");
  }());
  
  App.graph.on("remove", "node", function() {
    App.dataTab.reset();
  });

  App.graph.on("unselect", "node", function(event) {
    App.toolbox.unselectNode(event.cyTarget.data());
  });

  App.graph.on("select", "node", function(event) {
    App.toolbox.selectNode(event.cyTarget.data());
  });
});
