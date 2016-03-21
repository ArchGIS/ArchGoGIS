'use strict';

App.widgets.Map = function(params, id) {
  var tmpl =  _.template(`
    <div id="<%= id %>" style="width: 100%; height: 100%"></div>
  `);
                         
  var geo = {
    'kazan': [55.78, 49.13],
    'moscow': [55.76, 37.64]
  };
  var placemarks = {};
  var map = null;
  var eventsPool = {};

  params = _.extend({
    'center': geo.kazan,
    'zoom': 7,
    'controls': [
      'zoomControl',
      'searchControl',
      'typeSelector',
      'rulerControl'
    ]
  }, params);
  
  this.early = () => tmpl({'id': id});
  this.later = () => ymaps.ready(delayedLater);

  function delayedLater() {
    map = new ymaps.Map(id, {
      'center': params.center,
      'zoom': params.zoom,
      'controls': params.controls
    });

    map.behaviors.disable('dblClickZoom');

    // Включаем отложенные подписки на события.
    _.each(eventsPool, function(callback, event) {
      map.events.add(event, callback);
    });
    eventsPool = null; // Больше нам не нужно их держать.
  }

  this.center = function(coord, opts) {
    map.setCenter(coord, map.getZoom(), opts);
  };

  this.removePlacemark = function(id) {
    if (placemarks[id]) {
      map.geoObjects.remove(placemarks[id])
      delete placemarks[id];
    }
  };

  this.onPlacemark = function(id, event, callback) {
    placemarks[id].events.add(event, callback);
  };

  this.addPlacemark = function(coord, id, opts) {
    // https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/
    var placemark = new ymaps.Placemark(
      coord,
      {}, // Свойства отметки 
      opts
    );

    if (id) {
      placemarks[id] = placemark;
    }

    map.geoObjects.add(placemark);
  };

  this.updatePlacemark = function(id, coord, opts) {
    if (placemarks[id]) {
      placemarks[id].geometry.setCoordinates(coord);
    } else {
      this.addPlacemark(coord, id, opts);
    }
  };

  this.on = function(event, callback) {
    if (map) {
      map.events.add(event, callback);
    } else {
      // Не можем навесить событие до того, как будет создана карта.
      // Кладём подписку в очередь, биндить их будем позже.
      eventsPool[event] = callback;
    }
  };

  this.getCenter = () => map.getCenter();
};