'use strict';App.views.selection = new (Backbone.View.extend({  "show": function(data) {    App.views.addToMap(data.placemarks);    $("#container").tabs();    App.views.functions.setAccordion(".accordion");    $("#get-all-radiocarbon").on("click", function() {      var model = App.models.fn;      var carbons = [];      var query = {        main: JSON.stringify({          "mons:Monument": {"id": "NEED"},          "knows:Knowledge": {"id": "*"},          "carbon:Radiocarbon": {"id": "*", "select": "*"},          "mons__knows": {},          "knows__carbon": {},        }),      }      function drawDiagram(data) {        data = {          series: [            [5, 2, 4, 2, 0]          ],        };        new Chartist.Line('.ct-chart', data);        $(".ct-chart").css("height", "600px")      }      var generate = function() {        console.log(carbons)        var type = 'data:application/octet-stream;base64, ';        var text = 'Sum("sum_function") { \n';        _.each(carbons.main, function(monCarbons, i) {          _.each(monCarbons, function(carbon, t) {            text += `R-Date("${carbon.name}", ${carbon.date}, ${carbon.s});\n`;          })        })        text += '};';        var base = btoa(text);        var res = type + base;        $('#test').attr('href', res);        $('#test').show();                drawDiagram({});        // $.ajax({        //   'dataType': 'json',        //   'type': 'POST',        //   'url': '/oxcal',        //   'contentType': 'application/json',        //   'data': JSON.stringify(data),        //   'success': function(data) {        //     console.log(data);        //   },        // });      };      var callGenerate = _.after(1, generate);      var ids = _.map(data.monuments, function(obj) {return obj.id.toString()});      carbons = model.getData(query, callGenerate, true, ids);    })   },}))