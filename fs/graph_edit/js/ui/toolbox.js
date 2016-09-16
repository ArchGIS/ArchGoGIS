"use strict";

$(function() {
  var t = App.locale.translate;

  var $selector = $("#tab-selector");
  var $selected = null;
  var tabs = [];
  var tabNames = [];

  /**
   * @param {Object} cfg
   * @param {string[]} cfg.enabledTabs
   * @param {string[]} cfg.enabledGraphLayouts
   */
  function init(cfg) {
    tabNames = cfg.enabledTabs;

    var options = [];

    _.each(tabNames, (tabName, tabIndex) => {
      var n = tabIndex + 1;
      var text = t(`${tabName}.tabName`);

      options.push(`<option value="${tabIndex}">[${n}] ${text}</option>`);
    });

    $selector.html(options);

    _.each(tabNames, (tabName) => {
      tabs.push($("#" + tabName));
    });

    $selected = tabs[+$selector.find(":selected").val()];
    $selected.show();

    $selector.on("change", function() {
      setTab(+$selector.find(":selected").val());
    });

    App.graphControl.init(cfg.enabledGraphLayouts);
  }

  /**
   * @param {number} tabIndex
   */
  function setTab(tabIndex) {
    tabIndex = +tabIndex;
    var $newTab = tabs[tabIndex];

    if ($newTab) {
      if ($newTab != $selected) {
        $selected.hide();
        $selected = $newTab;
        $selected.show();

        $selector.val(tabIndex);
      }
    }
  }

  /**
   * @param {Node} node
   */
  function selectNode(node) {
    App.ui.nodeControl.loadNode(node);
  }

  /**
   * @param {Node} node
   */
  function unselectNode(node) {
    App.ui.nodeControl.updateNode(node);
    App.ui.nodeControl.reset();
  }

  App.toolbox = {
    "setTab": setTab,
    "init": init,
    "selectNode": selectNode,
    "unselectNode": unselectNode
  };
});