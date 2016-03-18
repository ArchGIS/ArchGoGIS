'use strict';

// Контейнеры
var App = {
  'widgets': {},
  'controllers': {},
  'models': {},
  'views': {}
};

// Зачатки переопределённых базовых классов Backbone?
App.Controller = Backbone.View.extend({});
App.View = Backbone.View.extend({});
App.Model = Backbone.Model.extend({});

var dburl = "http://localhost:8080/";

function setSelectsEvents() {
  var selects = $("select[dynamic=true]");

  $.each(selects, function(key, select) {
    var obj = $(select);
    obj.on("change", function() {showField(obj)});
    obj.trigger("change");
  })
}

function showField(select) {
  var selectName = select.attr("id");
  var dynamicFields = $("[toggle-by="+selectName+"]");
  var selectedValue = select.find("option:selected").val();
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
  var query = generateQuery();

  $.post("/hquery/upsert", JSON.stringify(query))
  .success(function(response) {
    console.log(response);
  })
}

function generateQuery() {
  var type, json = {};
  var objs = $("input[data-name]");
  var dataName, name, value;

  $.each(objs, function(key, obj) {
    json[$(obj).attr("data-name")] = {};
  })

  objs = $("[data-for][used!=false]");
  $.each(objs, function(key, obj) {
    dataName = $(obj).attr("data-for");
    type = ($(obj).attr("type") != "hidden") ? ("/" + $(obj).attr("type")) : "";
    name = $(obj).attr("name") + type;
    value = $(obj).val();

    json[dataName][name] = value;
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
