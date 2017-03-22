"use strict";

App.models.Monument = function Monument() {
  var props = {};
  App.models.proto.call(this, App.models.Monument.scheme, props);
};

App.models.Monument.findByNamePrefix = function(name, resId) {
  return new Promise(function(resolve, reject) {
    resId = resId || '';
    var url = App.url.make('/search/filter_monuments', {
      'name': name,
      'epoch': '',
      'resId': resId
    });

    $.get({
      url,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => resolve($.parseJSON(response)),
      error: reject
    });
  });
};

App.models.Monument.getActualSpatref = function(monId) {
  var d = $.Deferred();

  let query = JSON.stringify({
    "m:Monument": {"id": `${monId}`},
    "sr:SpatialReference": {"id": "*", "select": "*"},
    "srt:SpatialReferenceType": {"id": "*", "select": "*"},
    "m__has__sr": {},
    "sr__has__srt": {},
  });

  $.post({
    url: "/hquery/read",
    data: query,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: response => {
      let rows = $.parseJSON(response);
      let dataRet = {
        type: 6,
        date: 0, 
        x: "нет данных", 
        y: "нет данных",
        typeName: "нет данных"
      };

      _.each(rows.sr, function(coord, i) {
        if ((rows.srt[i].id < dataRet.type) || ((rows.srt[i].id == dataRet.type) && (coord.date > dataRet.date))) {
          dataRet.type = rows.srt[i].id;
          dataRet.typeName = rows.srt[i].name;
          dataRet.x = coord.x;
          dataRet.y = coord.y;
          dataRet.date = coord.date;
        }
      })
      d.resolve(dataRet);
    },
  });

  return d.promise();
};

App.models.Monument.findMonsByCoords = function(x, y) {
  var d = $.Deferred();
  name = name || ""; 
  let ids = [];
  let done = 0;

  let queries = [
    JSON.stringify({
      "m:Monument": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "filter": `x=${x}=number;y=${y}=number`},
      "knowledges__belongsto__m": {},
    }),

    JSON.stringify({
      "m:Monument": {"id": "*", "select": "*"},
      "sr:SpatialReference": {"id": "*", "filter": `x=${x}=number;y=${y}=number`},
      "m__has__sr": {},
    })
  ];

  _.each(queries, function(query) {
    $.post({
      url: "/hquery/read",
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => {
        let rows = $.parseJSON(response);
        _.each(rows.m, (mon) => ids.push(mon.id));
        done++;
        (done === 2) ? d.resolve(ids) : "";
      }
    });
  })

  return d.promise();
};

App.models.Monument.getData = function(name) {
  return new Promise(function(resolve, reject) {
    name = name || ""; 

    let query = JSON.stringify({
      "monument:Monument": {"id": "*", "select": "*"},
      "knowledges:Knowledge": {"id": "*", "select": "*", "filter": `monument_name=${name}=text`},
      "knowledges__belongsto__monument": {},
    });

    $.post({
      url: "/hquery/read",
      data: query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: response => {
        let rows = $.parseJSON(response);
        let dataRet = {};

        _.each(rows.knowledges, function(know, key) {
          let monId = rows.monument[key].id;
          if (!dataRet[monId]) {
            dataRet[monId] = {'id': monId, 'name': []};
          }
          dataRet[rows.monument[key].id].name.push(know.monument_name);
        })
        console.log(dataRet)
        resolve(dataRet)
      },
      error: reject
    });
  });
};

App.models.Monument.url = function(id) {
  return id ? '#monument/show/' + id : '#monument/show';
};

App.models.Monument.href = function(id, text) {
  return '<a href="' + App.models.Monument.url(id) + '">' + text + '</a>';
};

App.models.Monument.scheme = App.models.proto.parseScheme("monument", {
  "x": {
    "type": "number",
    "validations": []
  },
  "y": {
    "type": "number",
    "validations": []
  },
  "epoch": {
    "type": "text",
    "validations": []
  }
});
