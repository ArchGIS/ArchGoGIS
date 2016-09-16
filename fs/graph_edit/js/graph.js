"use strict";

$(function() {
  var t = App.locale.translate;
  var cy = null;

  var idSequence = 0;
  
  var $cytoscape = $("#cytoscape");
  var relativeCenter = {
    "x": $cytoscape.width() / 2.0,
    "y": $cytoscape.height() / 2.0
  };

  /*
   * Private:
   */

  /**
   * @param {string} layoutName
   * @param {number} nodeCount
   * @return {Object}
   */
  function createLayout(layoutName, nodeCount) {
    var cyLayoutName = (function() {
      switch (layoutName) {
      case "grid": return "grid";
      case "tree": return "breadthfirst";
      case "spread": return "cose";
      default: throw `unknown layout: ${layoutName}`;
      }
    }());

    var layoutPadding = (function() {
      switch (nodeCount) {
        case 1: return 180;
        case 2: return 90;
        default: return 45;
      }
    }());

    return {
      "name": cyLayoutName,
      "padding": layoutPadding
    };
  }

  /**
   * @param {string} firstId
   * @param {string} secondId
   */
  function createEdge(firstId, secondId) {
    return {
      "group": "edges",
      "data": {
        "source": firstId,
        "target": secondId
      }
    };
  }

  /**
   * @param {Node} node
   * @param {number} x
   * @param {number} y
   */
  function createNode(node, x, y) {
    return {
      "group": "nodes",
      "data": node,
      "position": {
        "x": x,
        "y": y
      }
    }
  }

  /*
   * Public:
   */

  /**
   * Инициализация графа.
   * Исходное состояние задаётся входными аргументами.
   * 
   * @param {Node[]} nodes
   */
  function init(nodes) {
    // Помечаем каждый node из стартового набора особой меткой.
    _.each(nodes, (node) => node.startingNode = true);

    var elems = {
      "nodes": _.map(nodes, (node) => ({"data": node}))
    };

    var style = cytoscape.stylesheet()
      .selector("node").css({
        "content": "data(label)",
        "text-valign": "center",
        "color": "#000"
      })
      .selector(":selected").css({/* default */})
      .selector("edge").css({
        "width": 2,
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      })
      .selector(".existing").css({
        "shape": "rectangle"
      });

    cy = cytoscape({
      "userZoomingEnabled": false,
      "boxSelectionEnabled": false,
      "elements": elems,
      "container": $cytoscape[0],
      "style": style
    });
  }

  /**
   * Увеличить текущий масштаб графа.
   */
  function zoomIn() {
    var zoom = cy.zoom();
    if (zoom < 3.0) {
      cy.zoom(zoom + zoom / 3.0);
    }
  }

  /**
   * Уменьшить текущий масштаб графа.
   */
  function zoomOut() {
    var zoom = cy.zoom();
    if (zoom > 0.25) {
      cy.zoom(zoom - zoom / 3.0);
    }
  }

  /**
   * Подписывает функцию `callback` на событие `trigger`.
   * Домен события ограничивается аргументом `target`.
   * Например, можно отслеживать события только вершин (node).
   * 
   * @param {string} trigger
   * @param {string} target
   * @param {function} callback
   */
  function bindEvent(trigger, target, callback) {
    cy.on(trigger, target, callback);
  }

  /**
   * Создать вершину, соединённую с текуще выбранной вершиной.
   * Принимает конструирующую функцию в качестве аргумента.
   * 
   * @param {function} NodeCtor
   */
  function addToSelected(NodeCtor) {
    var selected = cy.$(":selected");
    var id = "" + idSequence++;
    var pos = selected.position();

    var node = createNode(new NodeCtor(id), pos.x + 75, pos.y);
    var edge = createEdge(selected.id(), id);
    
    cy.add([node, edge]);
  }

  /**
   * Создаёт направленное ребро от вершины `a` к вершине `b`.
   * 
   * @param {Node} a
   * @param {Node} b
   */
  function connectNodes(a, b) {
    cy.add(createEdge(a.id, b.id));
  }

  /**
   * Удалить выделенный узел.
   * #FIXME: должен удалять все исходящие узлы.
   */
  function deleteSelected() {
    var selected = cy.$(":selected");
    if (0 == selected.length) { // Не выделено ни одного узла.
      return;
    }

    if (selected.data().startingNode) {
      App.alert.error(t("error.startingNodeRemove"));
      return;
    }
    
    if (selected.neighborhood("node").length < 2) {
      if (App.alert.confirm("Вы уверены, что хотите удалить этот элемент?")) {
        selected.remove();
      }
    } else {
      App.alert.error(t("error.nonLeafRemove"));
    }
  }

  /**
   * Возвращает массив вершин графа, которые соединены с `node` вершиной.
   * При передаче дополнительного аргумента `NodeCtor`, фильтрует результат
   * так, чтобы в него входили вершины указанного типа.
   * 
   * @param {Node} node
   * @param {function} NodeCtor
   * @return {Node[]}
   */
  function connectedNodes(node, NodeCtor) {
    var vertex = cy.$("#" + node.id); 
    var connectedVertices = vertex.neighborhood("node"); 
    
    if (NodeCtor) {
      var result = [];
      _.each(connectedVertices, (vertex) => {
        if (vertex.data().constructor == NodeCtor) {
          result.push(vertex.data());
        }
      });
      return result;
    } else {
      return _.invoke(connectedVertices, "data");
    }
  }

  /**
   * Запрещает выделение переданных вершин.
   * 
   * @param {Node|Node[]} nodes
   */
  function disable(nodes) {
    if (_.isArray(nodes)) {
      _.each(nodes, (node) => {
        cy.$("#" + node.id).unselectify();
      });
    } else {
      cy.$("#" + nodes.id).unselectify();
    }
  }

  /**
   * Делает переданные вершины выделяемыми.
   * 
   * @param {Node|Node[]} nodes
   */
  function enable(nodes) {
    if (_.isArray(nodes)) {
      _.each(nodes, (node) => {
        cy.$("#" + node.id).selectify();
      });
    } else {
      cy.$("#" + nodes.id).selectify();
    }
  }

  /**
   * Помечает вершину как существующую в базе данных.
   * 
   * @param {Node} node
   */
  function markAsExisting(node) {
    cy.$("#" + node.id).addClass("existing");
  }

  /**
   * Помечает вершину как новую запись, которая будет вставлена в базу данных.
   * 
   * @param {Node} node
   */
  function markAsNew(node) {
    cy.$("#" + node.id).removeClass("existing");
  }

  /**
   * Применяет выравнивание к графу.
   * Валидные опции: "grid", "tree", "spread".
   * 
   * @param {string} layoutName
   */
  function setLayout(layoutName) {
    cy.layout(createLayout(layoutName, cy.nodes().length));
  }

  App.graph = {
    "init": init,
    "on": bindEvent,
    "zoomIn": zoomIn,
    "zoomOut": zoomOut,
    "deleteSelected": deleteSelected,
    "addToSelected": addToSelected,
    "connectedNodes": connectedNodes,
    "connectNodes": connectNodes,
    "disable": disable,
    "enable": enable,
    "markAsExisting": markAsExisting,
    "markAsNew": markAsNew,
    "setLayout": setLayout
  };
});
