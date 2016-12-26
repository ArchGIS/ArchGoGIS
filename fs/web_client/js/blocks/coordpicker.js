'use strict';

App.blocks.coordpicker = function($el, params, id) {
  var $button = $('<span class="btn btn-default"><i id="pick-coord" class="fa fa-map-marker"></i></span>');
  var $x = $(params.inputs[0]);
  var $y = $(params.inputs[1]);
  var id = id || "";
  
  const map = params.map;
  
  $el.append($button);

  function updateInputValues(coords) {
    $x.val(coords.lat);
    $y.val(coords.lng);
    $x.trigger("change");
    $y.trigger("change");
  }

  // function updatePlacemark() {
  //   updateInputValues(map.getCenter());
  //   map.updatePlacemark($el.prop('id'), map.getCenter(), {'iconContent': id}, {'draggable': true});
  // }
  
  function createPlacemark() {
    // updatePlacemark();
    updateInputValues(map.getCenter());
    const mark = L.marker(map.getCenter(), {
      draggable: true
    }).addTo(map);
    
    mark.on('dragend', function(event) {
      updateInputValues(mark.getLatLng());
    });

    // Следующие клики ставят отметку в отображаемый центр карты.
    $button.on('click', () => {
      updateInputValues(map.getCenter());
      mark.setLatLng(map.getCenter());
    });
  }
  
  $button.one('click', createPlacemark);
};
