'use strict';

App.views.map = (types) => {
  let map = L.map('map').setView([55.78, 49.13], 6);

  let layerdefs = {
    mapnik: {
      name: "OSM",
      js: [],
      init: () => L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    },
    ysat: {
      name: "Yandex",
      js: ["/vendor/leaflet-plugins/layer/tile/yandex.mutant.js", "http://api-maps.yandex.ru/2.1/?&lang=ru-RU"],
      init: () => L.gridLayer.yandexMutant({type: "satellite"})
    },
    nyak: {
      name: "НЯК",
      js: ["/vendor/leaflet-plugins/layer/tile/yandex.mutant.js", "http://api-maps.yandex.ru/2.1/?lang=ru-RU"],
      init: () => L.gridLayer.yandexMutant({type: "publicMap"})
    },
    bing: {
      name: "Bing",
      js: ["/vendor/leaflet-plugins/layer/tile/Bing.js"],
      init: () => L.bingLayer("ArsyCBuz45S76eWTT5PxxWxS4Ud_XdFDXtoidgxHWYbRBY9BIR_bIcrhWzonDyGJ", {type: "Road"})
    },
    bingSputnik: {
      name: "Bing sp",
      js: ["/vendor/leaflet-plugins/layer/tile/Bing.js"],
      init: () => L.bingLayer("ArsyCBuz45S76eWTT5PxxWxS4Ud_XdFDXtoidgxHWYbRBY9BIR_bIcrhWzonDyGJ", {type: "AerialWithLabels"})
    },
    google: {
      name: "Google",
      js: ["/vendor/leaflet-plugins/layer/tile/Leaflet.GoogleMutant.js", "https://maps.googleapis.com/maps/api/js?key=AIzaSyARNP1tCHTxfeDKXTFbAsgsDKZeOMwPBxE"],
      init: () => L.gridLayer.googleMutant({type: "roadmap"})
    },
    googleSputnik: {
      name: "Google спутник",
      js: ["/vendor/leaflet-plugins/layer/tile/Leaflet.GoogleMutant.js", "https://maps.googleapis.com/maps/api/js?key=AIzaSyARNP1tCHTxfeDKXTFbAsgsDKZeOMwPBxE"],
      init: () => L.gridLayer.googleMutant({type: "satellite"})
    }
  };

  const yndx = new L.DeferredLayer(layerdefs.nyak);
  const yndxSputnik = new L.DeferredLayer(layerdefs.ysat);
  const google = new L.DeferredLayer(layerdefs.google);
  const googleSputnik = new L.DeferredLayer(layerdefs.googleSputnik);
  const osm = new L.DeferredLayer(layerdefs.mapnik).addTo(map);
  const bing = new L.DeferredLayer(layerdefs.bing);
  const bingSputnik = new L.DeferredLayer(layerdefs.bingSputnik);

  let overlayLayers = null;

  if (types) {
    overlayLayers = _.reduce(types, (memo, type) => {
      memo[App.store.mapTypes[type]] = L.featureGroup();
      return memo;
    }, {});

    _.each(overlayLayers, (layer) => {
      layer.addTo(map);
    });
  }

  const controls = L.control.layers(
    {
      'OSM': osm,
      'Google': google,
      'Google спутник': googleSputnik,
      "Yandex": yndx,
      "Yandex спутник": yndxSputnik,
      "Bing": bing,
      "Bing спутник": bingSputnik
    },
    overlayLayers
  ).addTo(map);

  const myC = new L.Control.Bookmarks()
    .setPosition('bottomleft')
    .addTo(map);

  L.Control.geocoder({
    position: 'topleft'
  }).addTo(map);

  L.control.measure({
    position: 'bottomright',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    localization: 'ru',
    activeColor: '#10B8CB',
    completedColor: '#10B8CB'
  }).addTo(map);

  return {
    map,
    overlayLayers
  }
};

App.views.addToMap = (placemarks) => {
  const types       = _.uniq( _.pluck(placemarks, 'type') ),
        mapInstance = App.views.map(types),
        map         = mapInstance.map,
        overlays    = mapInstance.overlayLayers;

  const icon16 = [16, 16],
        icon20 = [20, 20];
  const iconSizes = {
    research: icon20,
    monument: icon16,
    artifact: icon16,
    heritage: icon16,
    excavation: icon16
  }

  _.each(placemarks, function(item) {
    if (!item.coords[0] && !item.coords[1]) { return; }
    
    const pathToIcon = `/web_client/img/${App.store.pathToIcons[item.type]}`;
    const icon = L.icon({
      iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
      iconSize: iconSizes[`${item.type}`]
    });

    let marker = L.marker(L.latLng(item.coords[0], item.coords[1]), {
      icon: icon
    });

    marker.bindTooltip(item.pref.hintContent, {
      direction: 'top'
    });

    marker.on('mouseover', function(e) {
      this.openTooltip();
    });
    marker.on('mouseout', function(e) {
      this.closeTooltip();
    });
    marker.on('click', function(e) {
      location.hash = `${item.type}/show/${item.id}`
    });

    overlays[App.store.mapTypes[item.type]].addLayer(marker);
  });
};