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


const HOST_URL = `${location.protocol}//${location.host}`;

const modal = $('#modalWindow');
modal.easyModal({
  top: 200,
  overlay: 0.4,
  overlayClose: false,
  closeOnEscape: false
});

$('#modalWindow a').on('click', (e) => {
  modal.trigger('closeModal');
});

function setSelectsEvents() {
  let selects = $("[dynamic=true]");

  $.each(selects, (key, select) => {
    const obj = $(select);
    obj.on("change", () => { showField(obj) });
    obj.trigger("change");
  })
}

function showField(select) {
  let selectName = select.attr("id");
  const dynamicFields = $(`[toggle-by=${selectName}]`);
  let selectedValue = "";

  if (select.attr("type") === "checkbox") {
    selectedValue = (select.is(":checked")) ? "true" : "false";
  } else {
    selectedValue = select.find("option:selected").val();
  }

  let requiredOptions, obj;

  $.each(dynamicFields, (key, field) => {
    obj = $(field);
    requiredOptions = obj.attr("need-option").split(".");

    if ($(select).is("[used!=false]") === true && $.inArray(selectedValue, requiredOptions) !== -1) {
      obj.show().attr("used", true);
      obj.contents().attr("used", true);
    } else {
      obj.hide().attr("used", false);
      obj.contents().attr("used", false);

      if (obj.has("[type='checkbox']").length > 0) {
        const checkbox = obj.find("[type='checkbox']");
        checkbox.prop("checked", false);
        checkbox.trigger("change");
      }
    }

    if (obj.has("select").length > 0) {
      $(obj.find("select")).trigger("change");
    }
  })
}

function postQuery(objectId) {
  let iconButton = loading();

  let json = generateJson([
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
    ["Heritage", "Monument", "has"],
    ["Heritage", "HeritageStatus", "has"],
    ["Heritage", "SecurityType", "has"],
    ["Heritage", "SurveyMap", "has"],
    ["Heritage", "Image", "has"],
    ["Research", "Report", "has"],
    ["Research", "Image", "has"],
    ["Complex", "Artifact", "has"],
    ["Report", "Author", "hasauthor"],
    ["Author", "AuthorImage", "has"],
    ["Artifact", "ArtifactImage", "has"],
    ["Heritage", "File", "has"],
    ["Organization", "City", "has"],
    ["Report", "Organization", "in"],
    ["SurveyMap", "OwnType", "has"],
    ["SurveyMap", "DisposalType", "has"],
    ["SurveyMap", "FunctionalPurpose", "has"],
    ["SurveyMap", "Availability", "has"],
    ["SurveyMap", "UsageType", "has"],
    ["Image", "CardinalDirection", "has"]
  ]);

  let formdata = new FormData();

  const files = $('input[type=file][used!=false]');
  let uploadedFilesCounter = 0;

  let defer = $.Deferred();

  _.each(files, (element, index) => {
    if (element.files[0]) {
      let datafor = $(element).attr("data-for");
      let name = $(element).attr("name");

      uploadFile(element.files[0]).then(function(key) {
        if (!json[datafor]) {
          json[datafor] = {};
        }

        json[datafor][`${name}/text`] = key;

        if (++uploadedFilesCounter === files.length) {
          defer.resolve();
        }
      });
    } else if (++uploadedFilesCounter === files.length) {
      defer.resolve();
    }
  });

  if (files.length === 0) {
    defer.resolve();
  }

  $.when(defer).done(() => {
    console.log(json);

    _.each(json, (val, key) => {
      formdata.append(key, JSON.stringify(val));
    });

    $.ajax({
      url: "/hquery/upsert",
      data: formdata,
      type: "POST",
      processData: false,
      contentType: false,
      success: (response) => {
        console.log('upsert: ' + response);
        loading(iconButton);

        if (response.length == 4) {
          alert('При обработке данных на сервере произошла ошибка');
        } else {
          $('#toObject').attr('href', location.hash.replace('new', 'show/') + JSON.parse(response)[objectId]);
          modal.trigger('openModal');
        }
      }
    });
  });
}

function loading(load) {
  const template = '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
  const icon = $('#send-button i');
  let saveTmpl;

  if (load) {
    icon.parent().removeProp('disabled');
    icon.replaceWith(load);
  } else {
    icon.parent().prop('disabled', true);
    saveTmpl = icon.get(0);
    icon.replaceWith(template);
  }

  return saveTmpl;
};

function generateJson(relations) {
  let type, json = {};
  const inputs = $("[data-for][used!=false]");
  let $input, dataFor, dataType, name, value, inputName, counter,
      inputClass, inputSubclass, inputObjName, objs = {};

  $.each(inputs, (key, input) => {
    $input = $(input);
    dataFor = $input.attr("data-for");
    dataType = $input.attr("data-type") || $input.attr("type");
    type = (dataType != "id") ? ("/" + dataType) : "";
    name = ($input.attr("data-name") || $input.attr("name")) + type;
    value = $input.val().replace(/\n/g, "\\n");
    inputClass = dataFor.split(":")[1];
    inputSubclass = $input.attr("data-subclass") || inputClass;

    if (!value || ($input.attr("type") == "radio" && $input.is(":checked") == false)) {
      return true;
    }

    objs[inputSubclass] = objs[inputSubclass] || [];

    if ($input.attr("data-few")) {
      value = value.split(",")
      counter = 0;

      _.each(value, function(val) {
        inputObjName = dataFor.split(":")[0]+counter;
        objs[inputSubclass].push(inputObjName);
        json[inputObjName+":"+inputClass] = {};
        json[inputObjName+":"+inputClass]["id"] = val;
        counter++;
      });
    } else {
      inputObjName = dataFor.split(":")[0];
      objs[inputSubclass].push(inputObjName);
      json[dataFor] = json[dataFor] || {};
      if (type != "/file") {
        json[dataFor][name] = value;
      }
    }
  })

  _.each(relations, (relation) => {
    if (objs[relation[0]]) {
      objs[relation[0]] = $.unique(objs[relation[0]]);
    }

    _.each(objs[relation[0]], (objName, id) => {
      const allNames = _.uniq(objs[relation[1]]);

      if (objs[relation[1]]) {
        _.each(allNames, (name, id) => {
          let objId1 = objName.split("_")[1];
          let objId2 = name.split("_")[1];

          if (!(objId1 && objId2) || (objId1 === objId2)) {
            json[`${objName}__${relation[2]}__${name}`] = {};
          }
        })
      }
    })
  })

  return json;
}


function fillSelector(selector, data, notLike) {
  $.each(data.rows, (id, row) => {
    if (row.name != notLike) {
      $("<option></option>")
        .text(row.name)
        .val(row.id)
        .appendTo(selector);
    }
  })
}

function getDataForSelector(selector, dataType, notLike) {
  let query = {};
  notLike = notLike || "";

  if (App.store.selectData[dataType]) {
    fillSelector(selector, App.store.selectData[dataType], notLike);
  } else {
    query[`rows:${dataType}`] = {"id": "*", "select": "*"};
    query = JSON.stringify(query);

    $.post("/hquery/read", query).success((response) => {
      const data = JSON.parse(response);
      App.store.selectData[dataType] = data;
      fillSelector(selector, data, notLike);
    });
  }
}

function uploadFile (file) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append('reportKey', file, file.name);

    $.ajax({
      url: "/pfs/save",
      data: data,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      success: (response) => {
        resolve(response.key);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}


function isValidForm () {
  let isValid = true;
  const inputs = $('input[data-req][used!=false]');

  inputs.removeClass('error-input');
  inputs.prev().removeClass('error-input');

  _.each(inputs, function(input) {
    const $input = $(input);

    $input.blur(function() {
      const $this = $(this);
      if ( !$this.val() ) {
        if ($input.attr('data-req') == 'up') {
          $input.prev().addClass('error-input');
        } else {
          $this.addClass('error-input');
        }
        isValid = false;
      }
    });
  });

  inputs.blur();
  return isValid;
}
