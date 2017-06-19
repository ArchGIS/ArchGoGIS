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

        for (let i=0; i<data.prob.length; i++) {
          labels[i] = data.start + i*resolution;
        }

        data = {
          labels: labels,
          series: data.prob,
        };
        
        options = {
          axisX: {
            labelInterpolationFnc: function(value, index) {
             return index % 5 === 0 ? value : null;
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
            drawDiagram(JSON.parse(data));
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
  },
}))