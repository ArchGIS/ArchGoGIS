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


var dburl = `${location.protocol}//${location.host}`;

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
    ["Knowledge", "Artifact", "found"],
    ["Knowledge", "Culture", "has"],
    ["Knowledge", "Complex", "has"],
    ["Research", "Excavation", "has"],
    ["Monument", "Excavation", "has"],
    ["Monument", "Complex", "has"],
    ["Monument", "Epoch", "has"],
    ["Monument", "MonumentType", "has"],
    ["HeritageStatus", "Monument", "has"],
    ["Research", "Report", "has"],
    ["Complex", "Artifact", "has"],
    ["Report", "Author", "hasauthor"],
    ["Author", "AuthorImage", "has"],
    ["Artifact", "ArtifactImage", "has"],
    ["HeritageStatus", "File", "has"],
    ["Organization", "City", "has"],
    ["Report", "Organization", "in"]
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

  if (files.length == 0) {
    defer.resolve();
  }

  $.when(defer).done(function() {
    console.log(json);
    _.each(json, function(val, key) {
      formdata.append(key, JSON.stringify(val));
    });

    $.ajax({
      url: "/hquery/upsert",
      data: formdata,
      type: "POST",
      processData: false,
      contentType: false,
      success: function(response) {
        console.log('upsert: ' + response);

        if (response.length == 4) {
          alert('При обработке данных на сервере произошла ошибка');
        } else {
          alert('Успешно!');
        }
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
    value = $(input).val().replace(/\n/g, "\\n");
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

    _.each(objs[relation[0]], function(objName, id) {
      var allNames = _.uniq(objs[relation[1]])
      if (objs[relation[1]]) {
        _.each(allNames, function(name, id) {
          var objId1 = objName.split("del")[1];
          var objId2 = name.split("del")[1];
          if (!(objId1 && objId2) || (objId1 == objId2)) {
            json[objName+"_"+relation[2]+"_"+name] = {};
          }
        })
      }
    })
  })

  return json;
}


function fillSelector(selector, data, notLike) {
  $.each(data.rows, function(id, row) {
    if (row.name != notLike) {
      $("<option></option>")
      .text(row.name)
      .val(row.id)
      .appendTo(selector);
    }
  })
}

function getDataForSelector(selector, dataType, notLike) {
  var query = {};
  var notLike = notLike || "";

  if (App.store.selectData[dataType]) {
    fillSelector(selector, App.store[dataType], notLike);
  } else {
    query["rows:"+dataType] = {"id": "*", "select": "*"};
    query = JSON.stringify(query);

    $.post("/hquery/read", query).success(function(response) {
      var data = JSON.parse(response);
      App.store.selectData[dataType] = data;
      fillSelector(selector, data, notLike);
    });
  }
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

  inputs.blur();
  return isValid;
}
