var dburl = "http://localhost:8080/";


(function() {
  'use strict';

  var page = new function() {
    var $body = $('#body');
    var $title = $('#title');
    
    this.render = function(templateName, templateParams) {
      // Здесь должен быть запуск view, скорее всего...
      // Сама view уже должна знать свой title.
      
      templateParams = templateParams || {};
      
      // Здесь добавляем функции (пока одну) для рендеринга шаблона.
      templateParams.t = function(key) {
        return App.locale.translate(key.split('.'));
      };
    
      App.template.get(templateName, function(tmpl) {
        $body.html(tmpl(templateParams));
      });
      
      $title.text(App.locale.translate([
        'titles', App.router.current.controller(), App.router.current.action()
      ]));
    };

    this.clear = function() {
      $body.empty();
    };
  }();

  var locale = new function() {
    var dict = {};
    var currentName = '';

    this.set = function(name) {
      if (currentName != name) {
        $.ajax({
          'url': '/locales/' + name + '.json',
          'async': false // Возможно стоит сделать асинхронным
        }).success(function(newDict) {
          dict = newDict;
          currentName = name;
        });
      }
    };
    
    this.translate = function(keys) {
      if (!dict[keys[0]]) {
        return undefined;
      }
      
      return _.reduce(keys, function(translation, key) {
        return translation && translation[key] ? translation[key] : undefined
      }, dict);
    };
  }();

  window.App = {
    'page': page,
    'locale': locale,
    'template': {},
    'router': {},
    'controllers': {},
    'views': {},
    'models': {},
    'Model': {},
    'View': {}
  };
}());

App.Controller = Backbone.View.extend({});
App.View = Backbone.View.extend({});
App.Model = Backbone.Model.extend({});

App.locale.set('ru'); // Язык стоит брать из куков.

function activateMonNew(){
  $("#author-input").autocomplete({
    source: function(request, response) {
      $.get(dburl+"search/authors?needle="+request.term+"&limit=10", function(data) {
        response(_.map($.parseJSON(data), function(author) {
          return {label: author.name, id: author.id}
        }));
      });
    },
    minLength: 3,
    select: function(event, ui) { 
      $("#author-input-id").val(ui.item.id);

      var args = {
        "r:Research": {"id": "*", "select": "*"},
        "a:Author": {"id": $("#author-input-id").val()},
        "a_Created_r": {}
      }
      var researches = [];

      $.post(dburl+"hquery/read", JSON.stringify(args), function(data) {
        var data = $.parseJSON(data).r;
        var title;
        $.each(data, function(key, res) {
          title = res.description+" ("+res.year+")";
          researches.push({label: title, id: res.id})
        });
        $("#research-input").autocomplete({
          source: researches
        })
      })
    },
  }).focus(function(){            
    $(this).autocomplete("search");
  });

  $("#research-input").autocomplete({
    source: [],
    minLength: 0,
    select: function(event, ui) { 
      $("#research-input-id").val(ui.item.id);
      
      var args = {
        "monument:Monument": {"id": "*", "select": "*"},
        "researches:Research": {"id": $("#research-input-id").val()},
        "knowledge:Knowledge": {"id": "*", "select": "*"},
        "researches_Contains_knowledge": {},
        "knowledge_Describes_monument": {}
      }
      var monuments = [];

      $.post(dburl+"hquery/read", JSON.stringify(args), function(data) {
        console.log(data)
        var data = $.parseJSON(data).knowledge;
        var title;
        $.each(data, function(key, res) {
          title = res.name+" ("+res.culture+")";
          monuments.push({label: title, id: res.id})
        });
        $("#monument-input").autocomplete({
          source: monuments
        })
      })
    }
  }).focus(function(){            
    $(this).autocomplete("search");
  });

  $("#monument-input").autocomplete({
    source: function(request, response) {
      response(window[""+$("#research-input-id").val()]);
    },
    minLength: 0,
    select: function(event, ui) { 
      $("#monument-input-id").val(ui.item.id);
    }
  }).focus(function(){            
    $(this).autocomplete("search");
  });

  setSelectsEvents();
  setSwitches();
  $("#container").tabs();
}

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