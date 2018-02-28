'use strict';

App.views.selection = new (Backbone.View.extend({
  "show": function(data) {
    App.views.addToMap(data.placemarks);

    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");

    $("#get-all-radiocarbon").on("click", function() {
      var model = App.models.fn;
      var resolution = 20;
      var carbons = [];

      var query = {
        main: JSON.stringify({
          "mons:Monument": {"id": "NEED"},
          "knows:Knowledge": {"id": "*"},
          "carbon:Radiocarbon": {"id": "*", "select": "*"},
          "mons__knows": {},
          "knows__carbon": {},
        }),
      }

      function drawDiagram(data) {
        console.log(data)
        let labels = [];
        let options;
        let offset = Math.floor(data.prob.length / 7);

        for (let i=0; i<data.prob.length; i++) {
          labels[i] = data.start + i*resolution;
        }

        data = {
          labels: labels,
          series: [data.prob],
        };
        
        options = {
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % offset === 0 ? value : null;
            }
          },
          showPoint: false,
          showArea: true,
        }

        new Chartist.Line('.ct-chart', data, options);

        $(".ct-chart").css("height", "600px")
      }

      var generate = function() {
        console.log(carbons)
        var type = 'data:application/octet-stream;base64, ';
        var text = `Options() {Resolution=${resolution};}; Sum("sum_function") { \n`;

        _.each(carbons.main, function(monCarbons, i) {
          _.each(monCarbons, function(carbon, t) {
            text += `R_Date("${carbon.name}", ${carbon.date}, ${carbon.s});\n`;
          })
        })

        text += '};';

        var base = btoa(text);
        var res = type + base;
        $('#test').attr('href', res);
        $('#test').show();
        
        $.ajax({
          'dataType': 'json',
          'type': 'POST',
          'url': '/calibrate/',
          'contentType': 'application/json',
          'data': text,

          success: (data) => {
            console.log(data);
            drawDiagram(data);
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
          }
        });

      };

      var callGenerate = _.after(1, generate);

      var ids = _.map(data.monuments, function(obj) {return obj.id.toString()});
      carbons = model.getData(query, callGenerate, true, ids);
    }) 

    $("#get-sites-coords").on("click", function() {
      var model = App.models.fn;
      var sites = [];

      var queries = {
        main: JSON.stringify({
          "mons:Monument": {"id": "NEED"},
          "e:Epoch": {"id": "*", "select": "*"},
          "mt:MonumentType": {"id": "*", "select": "*"},
          "mons__e": {},
          "mons__mt": {},
        }),

        cults: JSON.stringify({
          "mons:Monument": {"id": "NEED"},
          "knows:Knowledge": {"id": "*", "select": "*"},
          "cults:Culture": {"id": "*", "select": "*"},
          "mons__knows": {},
          "knows__cults": {},
        }),

        coords: JSON.stringify({
          "mons:Monument": {"id": "NEED"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "mons__sp": {},
          "spt__sp": {},
        }),
      }

      var generate = function() {
        console.log(sites)
        var type = 'data:application/octet-stream;base64, ';
        var text = "", line;
        var names=[], cults=[], coords=[], epochs=[], mtypes=[];
        var count, name, mtype, epoch, cult, coord;

        _.each(sites.main, function(obj, i) {
          epochs[i] = [obj.e[0].name]; 
          mtypes[i] = [obj.mt[0].name]; 
          names[i] = _.uniq(_.pluck(sites.cults[i].knows, "name"));
          cults[i] = _.uniq(_.pluck(sites.cults[i].cults, "name"));
          coords[i] = App.fn.findActualSpatref(sites.coords[i].sp, sites.coords[i].spt);
        })

        normalizeStringArray(epochs)
        normalizeStringArray(mtypes)
        normalizeStringArray(names)
        normalizeStringArray(cults)

        _.each(names, function(obj, i) {
          count = Math.max(names[i].length, cults[i].length, 2)
          console.log(coords)
          for (var t=0; t<count; t++) {
            epoch = epochs[i][t] || " ".repeat(epochs[i][0].length - 3) + " | "
            mtype = mtypes[i][t] || " ".repeat(mtypes[i][0].length - 3) + " | "
            name = names[i][t] || " ".repeat(names[i][0].length - 3) + " | "
            cult = cults[i][t] || " ".repeat(cults[i][0].length - 3) + " | "
            
            coord = (t == 0) ? `N: ${coords[i].x}` : `E: ${coords[i].y}`
            if (t > 1) 
              coord = ""

            line = `${name} ${mtype} ${epoch} ${cult} ${coord}\n`;
            text += `${line}`;
          }

          text += "-".repeat(line.length) + `\n`;
        })

        var base = window.btoa(unescape(encodeURIComponent(text)));
        var res = type + base;
        $('#test').attr('href', res);
        $('#test').attr('download', 'sites_coordinates.txt');
        $('#test').show();
      };

      var queryCounter = _.size(queries);
      var callGenerate = _.after(queryCounter, generate);

      var ids = _.map(data.monuments, function(obj) {return obj.id.toString()});
      sites = model.getData(queries, callGenerate, true, ids);
    })

    var normalizeStringArray = function(array) {
      var maxLength = 0;

      _.each(array, function(str, i) {
        _.each(str, function(s, t) {
          if (s.length > maxLength) 
            maxLength = s.length;
        })
      })

      maxLength += 1;

      _.each(array, function(strings, i) {
        _.each(strings, function(str, t) {
          if (str.length < maxLength) 
            array[i][t] += " ".repeat(maxLength - str.length) + " | ";
        })
      })
    }  
  },
}))