'use strict';

// Контейнеры
var App = {
  'widgets': {},
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

function fillSelect(selectId, obj) {
  $.each(obj, function(key, value) {   
    $('#'+selectId)
      .append($("<option></option>")
      .attr("value", key)
      .text(value)); 
  });
}

function postQuery() {
  var query = generateQuery([
    "Author_Research_Created",
    "Research_Knowledge_Contains",
    "Knowledge_Monument_Describes",
    "Monument_Artifact_Contains",
    "Coauthor_Research_Helpedtocreate"
  ]);

  $.post("/hquery/upsert", JSON.stringify(query))
  .success(function(response) {
    console.log(response);
  })
}

function generateQuery(relations) {
  var type, json = {};
  var inputs = $("[data-for][used!=false]");
  var dataName, name, value, objs = {};

  $.each(inputs, function(key, input) {
    dataName = $(input).attr("data-for");
    type = ($(input).attr("type") != "hidden") ? ("/" + $(input).attr("type")) : "";
    name = $(input).attr("name") + type;
    value = $(input).val();

    if ($(input).attr("data-few")) {
      value = value.split(",")
      var i=0;
      var inputName = dataName.split(":")[0];
      var inputClass = dataName.split(":")[1];
      _.each(value, function(val) {
        objs[inputClass] = objs[inputClass] || [];
        objs[inputClass].push(inputName+i);

        json[inputName+i+":"+inputClass] = {};
        json[inputName+i+":"+inputClass]["id"] = val;
        i++;
      })
    } else {
      objs[dataName.split(":")[1]] = objs[dataName.split(":")[1]] || [];
      objs[dataName.split(":")[1]].push(dataName.split(":")[0]);

      json[dataName] = json[dataName] || {};
      json[dataName][name] = value;
    }
  })

  _.each(relations, function(val) {
    var relation = val.split("_");
    _.each(objs[relation[0]], function(val) {
      if (objs[relation[1]]) {
        json[val+"_"+relation[2]+"_"+objs[relation[1]][0]] = {};
      }
    })
  })

  console.log(json)
  return json;
}

function setSwitches() {
  var switches = $(".switch");

  $.each(switches, function(ket, obj) {
    $(obj).click(function() {
      $(obj).next().slideToggle(500);
    })
    $(obj).next().hide();
  })
}
