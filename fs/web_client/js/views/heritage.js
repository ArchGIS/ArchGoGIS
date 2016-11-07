'use strict';

App.views.heritage = new (App.View.extend({
  "new": function(argument) {
    $("#container").tabs();
    var coordpicker = App.blocks.coordpicker;

    coordpicker($('#coord-picker'), {
      inputs: ['#heritage-x', '#heritage-y'],
      map: 'map'
    });

    $(".date-picker").datepicker({
    	dateFormat: "dd.mm.yy"
    });

    var $heritageFile = $('#heritage-file-input');
    $heritageFile.change(App.fn.checkFileSize.bind($heritageFile, 50));

    setSelectsEvents();

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },
}));