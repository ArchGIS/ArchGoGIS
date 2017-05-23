'use strict';

App.views.map = () => {
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

  const controls = L.control.layers(
    {
      'OSM': osm,
      'Google': google,
      'Google спутник': googleSputnik,
      "Yandex": yndx,
      "Yandex спутник": yndxSputnik,
      "Bing": bing,
      "Bing спутник": bingSputnik
    }
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
    controls
  }
};

const setDefaultClassToMarkerCluster = (len) => {
  let type = 'marker-cluster marker-cluster-';
  
  if (len < 10) {
    type += 'small';
  } else if (len < 100) {
    type += 'medium';
  } else {
    type += 'large';
  }

  return type;
};

const monEpochsHash = [
  {r: 179, g: 178, b: 176},
  {r: 253, g:	4, b:	4},
  {r: 56, g: 252, b: 4},
  {r: 3, g: 26, b: 249},
  {r: 249, g: 183, b: 3},
  {r: 157, g: 112, b: 54},
  {r: 255, g: 3, b: 235},
  {r: 0, g: 0, b: 0}
];

const resTypeHash = [
  {r: 0, g: 0, b: 0},
  {r: 30, g: 30, b: 210},
  {r: 205, g: 133, b: 63},
  {r: 128, g: 0, b: 0}
];

App.views.createOverlays = (leaf, types) => {
  const cluster = L.markerClusterGroup({
    maxClusterRadius: 40,
    iconCreateFunction: (cluster) => {
      const markers = cluster.getAllChildMarkers();
      const markerTypes = [];
      let type = '';

      for (let marker of markers) {
        if (!_.contains(markerTypes, marker.type)) {
          markerTypes.push(marker.type);
        }

        if (markerTypes.length > 1) {
          type = setDefaultClassToMarkerCluster(markers.length);
          break;
        }
      };

      if (type === '') {
        if (markerTypes[0] === 'monument') {
          type = 'marker-cluster cluster-monument';
        } else if (markerTypes[0] === 'research') {
          type = 'marker-cluster cluster-research';
        } else if (markerTypes[0] === 'radiocarbon') {
          type = 'marker-cluster cluster-radiocarbon';
        } else {
          type = setDefaultClassToMarkerCluster(markers.length);
        }
      }

      return L.divIcon({
        html: '<div><span>' + markers.length + '</span></div>',
        className: type,
        iconSize: L.point(40, 40)
      });
    }
  });

  const overlayLayers = _.reduce(types, (memo, type) => {
    memo[App.store.mapTypes[type]] = L.featureGroup.subGroup(cluster);
    return memo;
  }, {});

  return {
    map: leaf.map,
    controls: leaf.controls,
    layers: overlayLayers,
    cluster
  };
};

App.views.addOverlaysToMap = (ov) => {
  ov.map.addLayer(ov.cluster);

  _.each(ov.layers, (layer, key) => {
    layer.addTo(ov.map);
    ov.controls.addOverlay(layer, key);
  });

  return ov;
};

App.views.addToMap = (placemarks, existMap) => {
  const types       = _.uniq( _.pluck(placemarks, 'type') ),
        mapInstance = existMap || App.views.map(),
        overlay     = App.views.createOverlays(mapInstance, types),
        map         = mapInstance.map;

  const ctl = App.locale.getLang() === "en" ? App.locale.cyrToLatin : src => src;

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

    marker.bindTooltip(ctl(item.pref.hintContent), {
      direction: 'top'
    });

    marker.on('mouseover', function(e) {
      this.openTooltip();
    });
    marker.on('mouseout', function(e) {
      this.closeTooltip();
    });
    marker.on('click', function(e) {
      window.open(`${HOST_URL}/index#${item.type}/show/${item.id}`, '_blank');
    });

    // Need for clusters
    marker.type = item.type;
    if (item.type === 'monument') {
      marker.epoch = parseInt(item.opts.preset.substr(item.opts.preset.indexOf('_') + 1));
    } else if (item.type === 'research') {
      marker.resType = parseInt(item.opts.preset.match(/\d+/)[0]);
    }

    overlay.layers[App.store.mapTypes[item.type]].addLayer(marker);
  });

  return App.views.addOverlaysToMap(overlay);
};

App.views.clearOverlays = (leaf) => {
  if (leaf) {
    _.each(leaf.layers, function (ov) {
      ov.remove();
      leaf.controls.removeLayer(ov);
    });
  }
};