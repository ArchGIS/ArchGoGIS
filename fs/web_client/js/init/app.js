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

// var dburl = "http://localhost:8080";
var dburl = "http://85.143.214.248:8080";

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

      if (obj.has("[type='checkbox']").length > 0) {
        var checkbox = obj.find("[type='checkbox']");
        checkbox.prop("checked", false);
        checkbox.trigger("change");
      }
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
    ["Knowledge", "Culture", "has"],
    ["Knowledge", "Complex", "has"],
    ["Research", "Excavation", "has"],
    ["Monument", "Complex", "has"],
    ["Monument", "Epoch", "has"],
    ["HeritageStatus", "Monument", "has"],
    ["Research", "Report", "hasreport"],
    ["Complex", "Artifact", "has"],
    ["Report", "Author", "hasauthor"],
    ["Author", "AuthorImage", "has"],
    ["Artifact", "ArtifactImage", "has"],
    ["HeritageStatus", "File", "has"],
    ["Organization", "City", "has"],
    ["Organization", "Report", "has"]
  ]);

  var formdata = new FormData();

  var files = $('input[type=file][used!=false]');
  var uploadedFilesCounter = 0;
  var defer = $.Deferred();

  _.each(files, function(element, index) {

    if (element.files[0]) {
      var datafor = $(element).attr("data-for");
      var name = $(element).attr("name");

      uploadFile(element.files[0]).then(function(key) {
        if (!json[datafor]) {
          json[datafor] = {};
        }

        json[datafor][`${name}/text`] = key;
        
        if (++uploadedFilesCounter == files.length) {
          defer.resolve();
        }
      });
    } else {
      if (++uploadedFilesCounter == files.length) {
        defer.resolve();
      }
    }
  });


  $.when(defer).done(function() {
    console.log(json);
    _.each(json, function(val, key) {
      formdata.append(key, JSON.stringify(val));
    });

    console.log(formdata.getAll("file:File"));

    $.ajax({
      url: "/hquery/upsert",
      data: formdata,
      type: "POST",
      processData: false,
      contentType: false,
      success: function(response) {
        console.log('upsert: ' + response);
        alert('Успешно!');
      }
    });
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
      if(type != "/file") {
        json[dataFor][name] = value;
      }
    }
  })

  _.each(relations, function(relation) {
    if (objs[relation[0]]) {
      objs[relation[0]] = $.unique(objs[relation[0]]);
    }
    
    _.each(objs[relation[0]], function(val) {
      console.log(_.uniq(objs[relation[1]]));
      var allNames = _.uniq(objs[relation[1]])
      if (objs[relation[1]]) {
        $.each(allNames, function(id, name) {
          json[val+"_"+relation[2]+"_"+name] = {};
        })
      }
    })
  })

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

function fillSelector(selector, dataType, notLike) {
  var query = {};
  var notLike = notLike || "";
  query["rows:"+dataType] = {"id": "*", "select": "*"};
  query = JSON.stringify(query);

  $.post("/hquery/read", query).success(function(response) {
    var data = JSON.parse(response);
    $.each(data.rows, function(id, row) {
      if (row.name != notLike) {
        $("<option></option>")
        .text(row.name)
        .val(row.id)
        .appendTo(selector);
      }
    })
  });
}

function uploadFile (file) {
  return new Promise(function (resolve, reject) {
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
        resolve(response.key);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
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


function validateCreatePages () {
  var isValid = true;
  var inputs = $('input[data-req][used!=false]');
  inputs.removeClass('error-input');
  inputs.prev().removeClass('error-input');

  _.each(inputs, function (input) {
    $(input).blur(function () {
      console.log($(input).attr('data-req'));
      if ( !$(this).val() ) {
        if ($(input).attr('data-req') == 'up') {
          $(input).prev().addClass('error-input');
        } else {
          $(this).addClass('error-input');
        }
        isValid = false;
      }
    });
  });

  console.log(inputs);
  inputs.blur();
  return isValid;
}