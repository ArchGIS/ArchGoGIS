'use strict';

// Контейнеры
var App = {
  'widgets': {},
  'blocks': {},
  'controllers': {},
  'models': {},
  'views': {},
  'fn': {}
};

// Зачатки переопределённых базовых классов Backbone?
App.Controller = Backbone.View.extend({});
App.View = Backbone.View.extend({});
App.Model = Backbone.Model.extend({});

var dburl = "http://localhost:8080/";

function setSelectsEvents() {
  var selects = $("[dynamic=true]");

  $.each(selects, function(key, select) {
    var obj = $(select);
    obj.on("change", function() {showField(obj)});
    obj.trigger("change");
  })
}

function showField(select) {
  var selectName = select.attr("id");
  var dynamicFields = $("[toggle-by="+selectName+"]");
  if (select.attr("type") == "checkbox") {
    var selectedValue = (select.is(":checked")) ? "true" : "false";
  } else {
    var selectedValue = select.find("option:selected").val();
  }
  var requiredOptions, obj;

  $.each(dynamicFields, function(key, field) {
    obj = $(field);

    requiredOptions = obj.attr("need-option").split(".");
    if ($(select).is("[used!=false]") == true && $.inArray(selectedValue, requiredOptions) != -1) {
      obj.show().attr("used", true);
      obj.contents().attr("used", true);
    } else {
      obj.hide().attr("used", false);
      obj.contents().attr("used", false);
    }

    if (obj.has("select").length > 0) {
      $(obj.find("select")).trigger("change");
    }
  })
}

function postQuery() {
  var json = generateJson([
    ["Author", "Research", "Created"],
    ["Author", "Report", "Created"],
    ["Research", "Knowledge", "Contains"],
    ["Knowledge", "Monument", "Describes"],
    ["Monument", "Artifact", "Contains"],
    ["Report", "Monument", "Contains"],
    ["Heritage_Object", "Monument", "Contains"],
    ["Coauthor", "Research", "HelpedToCreate"]
  ]);

  $.post("/hquery/upsert", JSON.stringify(json))
  .success(function(response) {
    console.log(response);
  })
}

function generateJson(relations) {
  var type, json = {};
  var inputs = $("[data-for][used!=false]");
  var dataFor, name, value, inputName, counter, inputClass, inputSubclass, inputObjName, objs = {};

  $.each(inputs, function(key, input) {
    dataFor = $(input).attr("data-for");
    type = ($(input).attr("type") != "hidden") ? ("/" + $(input).attr("type")) : "";
    name = $(input).attr("name") + type;
    value = $(input).val();
    inputClass = dataFor.split(":")[1];
    inputSubclass = $(input).attr("data-subclass") || inputClass;

    if (!value) {
      return true;
    }

    objs[inputSubclass] = objs[inputSubclass] || [];

    if ($(input).attr("data-few")) {
      value = value.split(",")
      counter = 0;
      
      _.each(value, function(val) {
        inputObjName = dataFor.split(":")[0]+counter;
        objs[inputSubclass].push(inputObjName);
        json[inputObjName+":"+inputClass] = {};
        json[inputObjName+":"+inputClass]["id"] = val;
        counter++;
      })
    } else {
      inputObjName = dataFor.split(":")[0];
      objs[inputSubclass].push(inputObjName);
      json[dataFor] = json[dataFor] || {};
      json[dataFor][name] = value;
    }
  })

  _.each(relations, function(relation) {
    if (objs[relation[0]]) {
      objs[relation[0]] = $.unique(objs[relation[0]]);
    }
    
    _.each(objs[relation[0]], function(val) {
      if (objs[relation[1]]) {
        json[val+"_"+relation[2]+"_"+objs[relation[1]][0]] = {};
      }
    })
  })

  console.log(json)
  console.log(objs)
  return json;
} 
