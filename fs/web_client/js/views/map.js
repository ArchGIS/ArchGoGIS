'use strict';

App.views.map = () => {
  let map = L.map('map', {preferCanvas: true, maxZoom: 16}).setView([55.78, 49.13], 6);
  map.mapOverlays = null;

  let layerdefs = {
    mapnik: {
      name: "OSM",
      js: [],
      init: () => L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 1, maxZoom: 18})
    },
    ysat: {
      name: "Yandex",
      js: [],
      init: () => L.tileLayer("http://sat{s}.maps.yandex.net/tiles?l=sat&v=3.383.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU", {subdomains:['01','02','03','04']})
    },
    nyak: {
      name: "НЯК",
      js: [],
      init: () => L.tileLayer("http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU", {subdomains:['01','02','03','04']})
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
      js: [],
      init: () => L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {subdomains:['mt0','mt1','mt2','mt3']})
    },
    googleSputnik: {
      name: "Google спутник",
      js: [],
      init: () => L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {subdomains:['mt0','mt1','mt2','mt3']})
    },
    strelb: {
      name: "Custom",
      js: [],
      init: () => L.tileLayer('/vendor/strelb/z{z}/{xx}/x{x}/{yy}/y{y}.jpg', {minZoom: 0, maxZoom: 11, zoomOffset: 1, xx: function(cc) {return parseInt(cc.x / 1000)}, yy: function(cc) {return parseInt(cc.y / 1000)}})
    },
    topoMarch: {
      name: "topo_m",
      js: [],
      init: () => L.tileLayer('http://maps.marshruty.ru/ml.ashx?al=1&x={x}&y={y}&z={z}', {minZoom: 8, maxZoom: 16})
    },
    relief: {
      name: "relief",
      js: [],
      init: () => L.tileLayer('https://maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg')
    },
    noMap: {
      name: "noMap",
      js: [],
      init: () => L.tileLayer("")
    }
  };

  L.easyButton('fa-camera', function(btn, map){
    App.views.clearOverlays(map.mapOverlays);
    App.views.addOverlaysToMap(map.mapOverlays, false, ["monument"])
    leafletImage(map, function(err, canvas) {
      var link = document.getElementById('link-snapshot');
      link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      link.click();

      App.views.clearOverlays(map.mapOverlays);
      App.views.addOverlaysToMap(map.mapOverlays, true)
    })
  }).addTo(map);

  const yndx = new L.DeferredLayer(layerdefs.nyak);
  const yndxSputnik = new L.DeferredLayer(layerdefs.ysat);
  const google = new L.DeferredLayer(layerdefs.google);
  const googleSputnik = new L.DeferredLayer(layerdefs.googleSputnik);
  const strelb = new L.DeferredLayer(layerdefs.strelb);
  const topo_m = new L.DeferredLayer(layerdefs.topoMarch);
  const noMap = new L.DeferredLayer(layerdefs.noMap);
  const osm = new L.DeferredLayer(layerdefs.mapnik);
  const relief = new L.DeferredLayer(layerdefs.relief);
  const bing = new L.DeferredLayer(layerdefs.bing).addTo(map);
  const bingSputnik = new L.DeferredLayer(layerdefs.bingSputnik);

  const controls = L.control.layers(
    {
      'Google': google,
      'Google спутник': googleSputnik,
      "Yandex": yndx,
      "Yandex спутник": yndxSputnik,
      "Bing": bing,
      "Bing спутник": bingSputnik,
      "Топо маршруты": topo_m,
      "Стрельбицкий 1882": strelb,
      "Рельеф": relief,
      "OSM": osm,
      "Без карты": noMap,
    }
  ).addTo(map);
  
  L.control.betterscale({metric: true, imperial: false}).addTo(map);

  const myC = new L.Control.Bookmarks()
    .setPosition('topright')
    .addTo(map);
  
  var geocoder = new L.Control.Geocoder.Nominatim({});
  L.Control.geocoder({
    position: 'topleft',
    geocoder: geocoder
  }).addTo(map);

  L.control.polylineMeasure({position:'bottomright',
   unit:'metres',
   showBearings:true,
   clearMeasurementsOnStop: false,
   showMeasurementsClearControl: true,
   showUnitControl: true}).
  addTo(map);

  map.mapOverlays = App.views.initOverlays(map, controls);

  return {
    map,
    controls
  }
};

const colors = {
  1: "#d9dbd0",
  2: "#cbe4de",
  3: "#bab86b",
  4: "#d5add2",
  5: "#edd994",
  6: "#e2b65f",
  7: "#c4d761",
  8: "#9bd0d8",
  9: "#e4ebc9",
  10:  "#f8e36c",
  11:  "#f2d19e",
  12:  "#f5cab9",
  13:  "#acbad7",
  14:  "#76a7cf",
  15:  "#f7c2d4",
  16:  "#c385b8",
  17:  "#8fac6c",
  18:  "#a69334",
  19:  "#abca9e",
  20:  "#67b09c",
  21:  "#86ae68",
  22:  "#e3775a",
  23:  "#e2dcce",
  24:  "#698daf",
  25:  "#dee38f",
  26:  "#e9efef",
  27:  "#6366b5",
}

const lang = App.locale.getLang();
const prefix = lang === 'ru' ? '' : `${lang}_`;

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


App.views.createOverlays = (leaf, types) => {
  const rmax = 30;

  const cluster = L.markerClusterGroup({
    maxClusterRadius: rmax + 10,
    iconCreateFunction: (cluster) => {
      const markers = cluster.getAllChildMarkers(),
            n = markers.length,
            markerTypes = [],
            strokeWidth = 1,
            r = rmax - 2 * strokeWidth - (n < 10 ? 12 : n < 100 ? 8 : n < 1000 ? 4 : 0),
            iconDim = (r + strokeWidth) * 2;

      let type = '';

      for (let marker of markers) {
        if (!_.contains(markerTypes, marker.type)) {
          markerTypes.push(marker.type);
        }

        if (markerTypes.length > 1) {
          type = setDefaultClassToMarkerCluster(n);
          break;
        }
      };

      if (type === '') {
        if (markerTypes[0] === 'monument') {
          const epochs = {
            '1': {
              name: 'Новое время',
              en_name: 'Modern time'
            },
            '2': {
              name: 'Средневековье',
              en_name: 'Middle ages'
            },
            '3': {
              name: 'Эпоха Великого переселения',
              en_name: 'Great Migration period'
            },
            '4': {
              name: 'Ранний железный век',
              en_name: 'Early Iron Age'
            },
            '5': {
              name: 'Эпоха палеометалла',
              en_name: 'Paleometal age'
            },
            '6': {
              name: 'Неолит',
              en_name: 'Neolithic'
            },
            '7': {
              name: 'Палеолит/Мезолит',
              en_name: 'Paleolitic/Mesolithic'
            },
            '8': {
              name: 'Не определена',
              en_name: 'Not defined'
            }
          };
          const data = d3.nest()
            .key(d => d.epoch)
            .entries(markers, d3.map);

          const html = bakeThePie({
            data: data,
            valueFunc: d => d.values.length,
            strokeWidth: 1,
            outerRadius: r,
            innerRadius: r - 10,
            pieClass: 'cluster-pie',
            pieLabel: n,
            pieLabelClass: 'marker-cluster-pie-label',
            pathClassFunc: d => "mon-category-" + d.data.key,
            pathTitleFunc: d => epochs[d.data.key][`${prefix}name`] + ' - ' + d.data.values.length
          });

          return L.divIcon({
            html: html,
            className: 'marker-cluster',
            iconSize: L.point(iconDim, iconDim)
          });
        } else if (markerTypes[0] === 'research') {
          const resTypes = {
            '1': {
              name: 'Нет данных',
              en_name: 'No data'
            },
            '2': {
              name: 'Разведка',
              en_name: 'Survey'
            },
            '3': {
              name: 'Аналитическое',
              en_name: 'Analisys'
            },
            '4': {
              name: 'Раскопки',
              en_name: 'Excavation'
            }
          }
          const data = d3.nest()
            .key(d => d.resType)
            .entries(markers, d3.map);

          const html = bakeThePie({
            data: data,
            valueFunc: d => d.values.length,
            strokeWidth: 1,
            outerRadius: r,
            innerRadius: r - 10,
            pieClass: 'cluster-pie',
            pieLabel: n,
            pieLabelClass: 'marker-cluster-pie-label',
            pathClassFunc: d => "res-category-" + d.data.key,
            pathTitleFunc: d => resTypes[d.data.key][`${prefix}name`] + ' - ' + d.data.values.length
          });

          return L.divIcon({
            html: html,
            className: 'marker-cluster',
            iconSize: L.point(iconDim, iconDim)
          });
        } else if (markerTypes[0] === 'radiocarbon') {
          type = 'marker-cluster cluster-radiocarbon';
        } else if (markerTypes[0] === 'excavation') {
          type = 'marker-cluster cluster-excavation';
        } else {
          type = setDefaultClassToMarkerCluster(n);
        }
      }

      return L.divIcon({
        html: '<div><span>' + n + '</span></div>',
        className: type,
        iconSize: L.point(iconDim, iconDim)
      });
    }
  });

  const overlayLayersClusters = _.reduce(types, (memo, type) => {
    memo[type] = L.featureGroup.subGroup(cluster);
    return memo;
  }, {});

  const overlayLayers = _.reduce(types, (memo, type) => {
    memo[type] = L.featureGroup();
    return memo;
  }, {});

  leaf.map.fire('bookmark:remove', {
    data: {
      id: '10000',
    }
  });

  leaf.map.fire('bookmark:remove', {
    data: {
      id: '10001',
    }
  });

  leaf.map.fire('bookmark:add', {
    data: {
      id: '10000',
      name: 'Болгар',
      latlng: [54.98, 49.05],
      your_key: 'your value'
    }
  });

  leaf.map.fire('bookmark:add', {
    data: {
      id: '10001',
      name: 'Свияжск',
      latlng: [55.77165, 48.65804], 
      your_key: 'your value'
    }
  });

  return {
    map: leaf.map,
    controls: leaf.controls,
    layers: overlayLayers,
    layersC: overlayLayersClusters,
    cluster
  };
};

App.views.initOverlays = (map, control) => {
  let data = JSON.stringify({"areas:SpatialReferenceArea": {"id": "*", "select": "*"}});
  let climatLayer = L.featureGroup();;

  $.post({
    url: "/hquery/read?limit=1000",
    data: data,
    async: true,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: (response) => {
      response = JSON.parse(response)
      _.each(response.areas, function(val, i) {
        let polygon = App.controllers.fn.createPolygonPlacemark('climat', 1, val.polygonCoords, val.name, "", val.type);
        climatLayer.addLayer(createPolygon(polygon));
      })
    }
  });
  control.addOverlay(climatLayer, "Зоны растительности");

  control.addOverlay(new L.DeferredLayer({
    name: "water",
    init: () => L.tileLayer('https://maps-for-free.com/layer/water/z{z}/row{y}/{z}_{x}-{y}.gif')
  }), "Внутренние водоемы")
}

App.views.addOverlaysToMap = (ov, needCluster, types) => {
  needCluster = needCluster || false;
  types = types || _.keys(App.store.mapTypes);
  let layers = ov.layers;

  if (needCluster) {
    ov.map.addLayer(ov.cluster);
    layers = ov.layersC;
  }

  _.each(layers, (layer, key) => {
    if (App.store.mapTypes[key].show && _.contains(types, key)) {
      layer.addTo(ov.map);
    }
    ov.controls.addOverlay(layer, App.store.mapTypes[key].name);
  });
  
  return ov;
};

function onEachFeature(feature, layer) {
  layer.bindTooltip(feature.props.tooltip);
}

function createPolygon(item) {
  if (!item.polygonCoords && (!item.coords[0] || !item.coords[1])) { return; }

  let latlngs = [];
  let x = true;
  let doubleCoords = [];

  let options = {
    style: {color: colors[item.epoch],
      "weight": 0,
      "fillOpacity": 1
    },
    onEachFeature: onEachFeature,
    fillOpacity: .25, 
    opacity: 1, 
    weight: 3,
    color: colors[item.epoch]
  };

  var states = [{
    "type": "Feature",
    "props": {
      "tooltip": item.pref.hintContent
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": JSON.parse(item.polygonCoords)
    }
  }];

  return L.geoJSON(states, options);
}

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
    if (!item.polygonCoords && (!item.coords[0] || !item.coords[1])) { return; }

    const pathToIcon = `/web_client/img/${App.store.pathToIcons[item.type]}`;
    const icon = L.icon({
      iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
      iconSize: iconSizes[`${item.type}`]
    });

    let marker;
    if (item.polygon) {
      marker = createPolygon(item);
    } else { 
      marker = L.marker(L.latLng(item.coords[0], item.coords[1]), {
        icon: icon
      });

      marker.on('click', function(e) {
        window.open(`${HOST_URL}/index#${item.type}/show/${item.id}`, '_blank');
      });

      marker.bindTooltip(ctl(item.pref.hintContent), {
        direction: top
      });

      marker.on('mouseover', function(e) {
        this.openTooltip();
      });
      marker.on('mouseout', function(e) {
        this.closeTooltip();
      });
    }


    // Need for clusters
    marker.type = item.type;
    if (item.type === 'monument') {
      marker.epoch = parseInt(item.opts.preset.substr(item.opts.preset.indexOf('_') + 1));
    } else if (item.type === 'research') {
      marker.resType = parseInt(item.opts.preset.match(/\d+/)[0]);
    }

    overlay.layersC[item.type].addLayer(marker);
    overlay.layers[item.type].addLayer(marker);
  });

  map.mapOverlays = App.views.addOverlaysToMap(overlay, true);
  return map.mapOverlays;
};

App.views.clearOverlays = (leaf) => {
  if (leaf) {
    _.each(leaf.layers, function (ov) {
      leaf.map.removeLayer(ov)
      leaf.controls.removeLayer(ov);
    });

    _.each(leaf.layersC, function (ov) {
      leaf.map.removeLayer(ov)
      leaf.controls.removeLayer(ov);
    });
  }
};

function bakeThePie(options) {
    /*data and valueFunc are required*/
    if (!options.data || !options.valueFunc) {
        return '';
    }
    var data = options.data,
        valueFunc = options.valueFunc,
        r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
        rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
        strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
        pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
        pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
        pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
        pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
        pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label
        
        origo = (r+strokeWidth), //Center coordinate
        w = origo*2, //width and height of the svg element
        h = w,
        donut = d3.layout.pie(),
        arc = d3.svg.arc()
          .innerRadius(rInner)
          .outerRadius(r);
          // .startAngle(0)
          // .endAngle(Math.PI * 2);
        
    //Create an svg element
    var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    //Create the pie chart
    var vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);
        
    var arcs = vis.selectAll('g.arc')
        .data(donut.value(valueFunc))
        .enter().append('svg:g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + origo + ',' + origo + ')');
    
    arcs.append('svg:path')
        .attr('class', pathClassFunc)
        .attr('stroke-width', strokeWidth)
        .attr('d', arc)
        .append('svg:title')
          .text(pathTitleFunc);
                
    vis.append('text')
        .attr('x',origo)
        .attr('y',origo)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        // .attr('dy','.3em')
        .text(pieLabel);
    //Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
}


function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}