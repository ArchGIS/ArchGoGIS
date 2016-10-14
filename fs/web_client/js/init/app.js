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

var dburl = "http://localhost:8080";

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
    ["Research", "Author", "hasauthor"],
    ["Research", "Coauthor", "hascoauthor"],
    ["Research", "Knowledge", "has"],
    ["Research", "ResearchType", "has"],
    ["Knowledge", "Monument", "belongsto"],
    ["Knowledge", "Artifact", "founded"],
    ["Knowledge", "Epoch", "has"],
    ["Knowledge", "Culture", "has"],
    ["HeritageStatus", "Monument", "contains"],
    ["Research", "Report", "hasreport"],
    ["Report", "Author", "hasauthor"]
  ]);

  var formdata = new FormData();

  _.each(json, function(val, key) {
    formdata.append(key, JSON.stringify(val));
  })

  $.ajax({
    url: "/hquery/upsert",
    data: formdata,
    type: "POST",
    processData: false,
    contentType: false,
    success: function(response) {
      alert('Успешно!');
    }
  });
}

function generateJson(relations) {
  var type, json = {};
  var inputs = $("[data-for][used!=false]");
  var dataFor, name, value, inputName, counter, inputClass, inputSubclass, inputObjName, objs = {};

  $.each(inputs, function(key, input) {
    dataFor = $(input).attr("data-for");
    type = ($(input).attr("type") != "id") ? ("/" + $(input).attr("type")) : "";
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

  // Может быть в следующий раз
  // var required = $("[required][used!=false]");
  // $.each(required, function(key, input) {
  //   dataFor = $(input).attr("data-for");
  //   if (!json[dataFor]) {
  //     json[dataFor] = {};
  //   }
  //   console.log(dataFor);
  // });

  console.log(json)
  console.log(objs)
  return json;
} 


function getXlsxData() {
  App.store.xlsxData = '{"Header":["Номер","Название памятника","X","Y","Тип памятника","Культура","Эпоха","Описание","Библиографическая ссылка","Страница"],"Rows":[["333","Памятник1","11111","2223","Городище","Татарская","Средневековье","Пам1","фыва","123"],["222","Памятник2","2222","3333","Могильник","Монгольская","XII век","Пам2","авыф","234"]]}';
  App.store.xlsxData = $.parseJSON(App.store.xlsxData)
}

function addPages() {
  var count = App.store.xlsxData.Rows.length;
  for (var i=1; i<=count; i++) {
    $("#tabs").append('<li onclick=fillXlsxData('+(i-1)+')><a href="#home">'+i+'</a></li>');
  }
  $("#container").tabs();
}

function setInputEvents() {
  var inputs = $.find('input');
  $.each(inputs, function(key, val) {
    $(val).on("change", function(q) {changeXlsxValue(key, $(val).val())})
  })
}

function changeXlsxValue(id, value) {
  App.store.xlsxData["Rows"][App.store.tabId][id] = value;
}

function fillXlsxData(id) {
  id = id || 0;
  var counter = 0;
  var inputs = $.find('input');
  $.each(inputs, function(key, val) {
    $(val).val(App.store.xlsxData["Rows"][id][counter++]);
  })
  App.store.tabId = id;
}

function createMonumentsFromXlsx() {
  var queryTemplate = {
    "map:Literature": {"id":0},
    "e:Epoch": {},
    "map_References_m": {},
    "k:Knowledge": {},
    "m:Monument": {},
    "c:Culture": {},
    "e_Has_m": {},
    "r_Contains_k": {},
    "r_Has_map": {},
    "k_Describes_m": {},
    "c_Has_m": {}
  }

  var inputs = $.find('input');

  var query = queryTemplate;
  var dataFor;
  var inputName; 
  var counter = 0;

  $.each(inputs, function(key, val) {
    dataFor = $(val).attr("data-for");
    inputName = $(val).attr("name");

    if (dataFor) {
      query[dataFor][inputName] = App.store.xlsxData["Rows"][0][counter++]
    }
  })

  console.log(query);
}

function fillSelector(selector, dataType) {
  var query = {};
  query["rows:"+dataType] = {"id": "*", "select": "*"};
  query = JSON.stringify(query);

  $.post("/hquery/read", query).success(function(response) {
    var data = JSON.parse(response);
    $.each(data.rows, function(id, row) {
      $("<option></option>")
        .text(row.name)
        .val(row.id)
        .appendTo(selector);
    })
  });
}


function uploadFile (selector) {
  var file = $(selector)[0].files[0];

  if (file) {
    var data = new FormData();
    data.append('reportKey', file, file.name);

    $.ajax({
      url: "/pfs/save",
      data: data,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function(response) {
        console.log(response);
      }
    });
  }
}

function downloadFile (key) {
  var data = {"key": key}

  $.ajax({
    url: "/pfs/load",
    data: data,
    type: "POST",
    // dataType: "application/pdf",
    processData: false,
    contentType: false
  });
}