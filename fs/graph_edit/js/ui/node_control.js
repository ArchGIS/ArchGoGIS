"using strict";

$(function() {
  var t = App.locale.translate;

  var $menu = $("#selected-node-menu");
  var $emptyMenu = $("#empty-node-menu");

  var $addNode = $("#add-node");
  var $availableNodes = $("#available-nodes");

  var $typeSelector = $("#node-type-select");
  var $nodeProps = $("#node-props");

  var currentNode = null;

  function renderInputs(node) {
    var ctorName = node.constructor.name;
    var parts = [];

    _.each(node.schema, (info, key) => {
      if (!info.key && node.isExisting) {
        return;
      }

      var labelText = t(`${ctorName}.props.${key}`);

      var value = node.props[key];
      var inputHtml = (function() {
        switch (info.type) {
        case T_TEXT: 
          return `<textarea id="node-${key}" class="node-input">${value}</textarea>`;
        default:
          return `<input id="node-${key}" class="node-input" value="${value}">`;
        }
      }());

      parts.push(`
        <label>
          <table class="pure-table" style="width: 100%">
            <tr>
              <td width="40%">${labelText}</td>
              <td width="60%">${inputHtml}</td>
            </tr>
          </table>
        </label>
      `);
    });

    $nodeProps.html(parts);
  }

  $typeSelector.on("change", function() {
    var isExisting = "existing" == $typeSelector.find(":selected").val();

    if (isExisting) {
      App.graph.markAsExisting(currentNode);
    } else {
      App.graph.markAsNew(currentNode);
    }

    currentNode.isExisting = isExisting;
    updateNode(currentNode);
    renderInputs(currentNode);
  });

  /**
   * @param {Node} node
   */
  function loadNode(node) {
    currentNode = node;
    var actions = node.actions;

    $menu.show();
    $emptyMenu.hide();

    // "Присоединить элемент"
    if (actions.add) {
      $addNode.show();

      var parts = [];
      _.each(actions.add, (ctorName) => {
        var text = t(`${ctorName}.short`);
        parts.push(`
          <div class="pure-u-1-2">
            <button class="pure-button" style="width: 100%">
              ${text}
            </button>
          </div>
        `);
      });
      $availableNodes.html(parts);
    } else {
      $addNode.hide();
    }

    // "Свойства элемента"
    (function() {
      $typeSelector.val(node.isExisting ? "existing" : "new");
      renderInputs(node);
    }());
    
  }

  /**
   * @param {Node} node
   */
  function updateNode(node) {
    _.each(node.schema, (info, key) => {
      var $input = $(`#node-${key}`);

      if ($input[0]) {
        node.props[key] = $input.val();
      }
    });
  }

  function reset() {
    $menu.hide();
    $emptyMenu.show();
  }

  App.ui.nodeControl = {
    "loadNode": loadNode,
    "updateNode": updateNode,
    "reset": reset
  };
});