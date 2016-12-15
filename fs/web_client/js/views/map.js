'use strict';

App.views.map = function() {
  let map = L.map('map').setView([55.78, 49.13], 6);

  let layerdefs = {
    mapnik: {
      name: "OSM", js: [],
      init: function() {return new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');}
    },
    ysat: {
      name: "Yandex", js: ["/vendor/leaflet-plugins/layer/tile/Yandex.js", "http://api-maps.yandex.ru/2.1/?&lang=ru-RU"],
      init: function() {return new L.Yandex("satellite"); }
    },
    nyak: {
      name: "НЯК",
      js: ["/vendor/leaflet-plugins/layer/tile/Yandex.js", "http://api-maps.yandex.ru/2.1/?lang=ru-RU"],
      init: function() {return new L.Yandex("publicMap"); }
    },
    bing: {
      name: "Bing", js: ["/vendor/leaflet-plugins/layer/tile/Bing.js"],
      init: () => { return new L.BingLayer("ArsyCBuz45S76eWTT5PxxWxS4Ud_XdFDXtoidgxHWYbRBY9BIR_bIcrhWzonDyGJ", {type: "Road"}) }
    },
    google: {
      name: "Google",
      js: ["/vendor/leaflet-plugins/layer/tile/Leaflet.GoogleMutant.js", "https://maps.googleapis.com/maps/api/js?key=AIzaSyARNP1tCHTxfeDKXTFbAsgsDKZeOMwPBxE"],
      init: () => { return new L.gridLayer.googleMutant({type: "roadmap"}) }
    }
  };

  let yndx = new L.DeferredLayer(layerdefs.nyak).addTo(map);
  let google = new L.DeferredLayer(layerdefs.google);
  let osm = new L.DeferredLayer(layerdefs.mapnik);
  let bing = new L.DeferredLayer(layerdefs.bing);

  L.control.layers(
    {
      'OSM': osm,
      'Google': google,
      "Yandex": yndx,
      "Bing": bing
    }
  ).addTo(map);

  return map;
}


App.views.mapControl = function() {
  return {
    leftMarker: (points) => {
      let point = null;

      point = _.min(points, (p) => {
        return p[0]
      })

      return point
    },

    rightMarker: (points) => {
      let point = null;

      point = _.max(points, (p) => {
        return p[0]
      })

      return point
    },

    upMarker: (points) => {
      let point = null;

      point = _.min(points, (p) => {
        return p[0]
      })

      return point
    },

    downMarker: (points) => {
      let point = null;

      point = _.min(points, (p) => {
        return p[0]
      })

      return point
    },
  }
}