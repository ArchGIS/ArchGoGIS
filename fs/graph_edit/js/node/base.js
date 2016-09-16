"use strict";

var T_STRING = 0;
var T_INT = 1; 
var T_NUM = 2; 
var T_YEAR = 3;
var T_TEXT = 4;

(function() {
  var t = App.locale.translate;
  
  /*
   * Значимые ключи в schema:
   * "default" -- либо значение, либо функция для вычисления значения по умолчанию.
   * "key" -- задавать как true для атрибутов, которые являются частью ключа сущности.
   * "type" -- тип поля. Одно из: T_STRING, T_INT, T_NUM, T_TEXT
   */

  function Base(id, NodeCtor) {  
    this.isExisting = false; 
    this.startingNode = false;

    this.id = id;
    this.label = App.locale.translate(`${NodeCtor.name}.short`);
    this.actions = NodeCtor.actions;
    this.schema = NodeCtor.schema;

    this.props = _.mapObject(
      NodeCtor.schema,
      (info, key) => {
        if (_.isFunction(info.default)) {
          return info.default();
        } else {
          return info.default || "";
        }
      }
    );
  }

  App.node.Base = Base;
}())