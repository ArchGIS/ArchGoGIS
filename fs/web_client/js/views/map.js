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

  const overlayLayers = _.reduce(types, (memo, type) => {
    memo[App.store.mapTypes[type]] = L.featureGroup.subGroup(cluster);
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
  let data = JSON.stringify({"areas:SpatialReferenceArea": {"id": "*", "select": "*"}});
  $.post({
    url: "/hquery/read?limit=1000",
    data: data,
    async: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    },
    success: (response) => {
      response = JSON.parse(response)
      _.each(response.areas, function(val, i) {
        placemarks.push(
          App.controllers.fn.createPolygonPlacemark('climat', 1, val.polygonCoords, val.name, "", val.type)
        );
      })
    }
  });
  console.log(placemarks)
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
      let latlngs = [];
      let x = true;
      let doubleCoords = [];

      function onEachFeature(feature, layer) {
        layer.bindTooltip(feature.props.tooltip);
      }

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

      marker = L.geoJSON(states, options);
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

    overlay.layers[App.store.mapTypes[item.type]].addLayer(marker);
  });
  
  return App.views.addOverlaysToMap(overlay);
};

App.views.clearOverlays = (leaf) => {
  if (leaf) {
    _.each(leaf.layers, function (ov) {
      leaf.controls.removeLayer(ov);
    });

    leaf.cluster.clearLayers();
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