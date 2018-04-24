(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.leafletImage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global L */

var queue = require('d3-queue').queue;

var cacheBusterDate = +new Date();

var legendEpoch = [
    {show: false, name: "Modern time", color: "rgba(178,178,178,1)"},
    {show: false, name: "Middle ages", color: "rgba(255,0,0,1)"},
    {show: false, name: "Great Migration period", color: "rgba(56,252,0,1)"},
    {show: false, name: "Early Iron Age", color: "rgba(3,26,250,1)"},
    {show: false, name: "Paleometal age", color: "rgba(250,183,3,1)"},
    {show: false, name: "Neolithic", color: "rgba(157,112,54,1)"},
    {show: false, name: "Paleolitic/Mesolithic", color: "rgba(255,3,235,1)"},
    {show: false, name: "Not defined", color: "rgba(0,0,0,1)"}
];

var legendSiteType = [
    {show: false, name: "Fortified settlement (hillfort)", img: "monType1_1.png"},
    {show: false, name: "Unfortified settlement (camp/village)", img: "monType2_1.png"},
    {show: false, name: "Find", img: "monType3_1.png"},
    {show: false, name: "Cemetery", img: "monType4_1.png"},
    {show: false, name: "Burial mound", img: "monType5_1.png"},
    {show: false, name: "Productuion place", img: "monType6_1.png"},
    {show: false, name: "Sanctuary", img: "monType7_1.png"},
    {show: false, name: "Hoard", img: "monType8_1.png"},
    {show: false, name: "Complex", img: "monType9_1.png"},
    {show: false, name: "Architecture", img: "monType10_1.png"},
    {show: false, name: "Not defined", img: "monType11_1.png"},
    {show: false, name: "Tombstone", img: "monType12_1.png"},
];

// leaflet-image
module.exports = function leafletImage(map, callback) {

    var hasMapbox = !!L.mapbox;
    var count = 1;

    var dimensions = map.getSize(),
        layerQueue = new queue(1);

    var x = dimensions.x;
    var y = dimensions.y;

    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y + 300;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, x, y + 300);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, y, x, 2);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Legend", 30, y + 30);

    // dummy canvas image when loadTile get 404 error
    // and layer don't have errorTileUrl
    var dummycanvas = document.createElement('canvas');
    dummycanvas.width = 1;
    dummycanvas.height = 1;
    var dummyctx = dummycanvas.getContext('2d');
    dummyctx.fillStyсle = 'rgba(0,0,0,0)';
    dummyctx.fillRect(0, 0, 1, 1);

    // layers are drawn in the same order as they are composed in the DOM:
    // tiles, paths, and then markers
    map.eachLayer(drawTileLayer);
    map.eachLayer(drawEsriDynamicLayer);
    
    if (map._pathRoot) {
        layerQueue.defer(handlePathRoot, map._pathRoot);
    } else if (map._panes) {
        var firstCanvas = map._panes.overlayPane.getElementsByTagName('canvas').item(0);
        if (firstCanvas) { layerQueue.defer(handlePathRoot, firstCanvas); }
    }
    map.eachLayer(drawMarkerLayer);
    layerQueue.awaitAll(layersDone);

    function drawTileLayer(l) {
        if (l instanceof L.TileLayer) layerQueue.defer(handleTileLayer, l);
        else if (l._heat) layerQueue.defer(handlePathRoot, l._canvas);
    }

    function drawMarkerLayer(l) {
        if (l instanceof L.Marker && l.options.icon instanceof L.Icon) {
            layerQueue.defer(handleMarkerLayer, l, count++);
        }
    }
    
    function drawEsriDynamicLayer(l) {
        if (!L.esri) return;
       
        if (l instanceof L.esri.DynamicMapLayer) {                       
            layerQueue.defer(handleEsriDymamicLayer, l);
        }
    }

    function drawLegend() {
        var legendX = 30;
        var legendY = y + 45
        var im; 

        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.font = "16px Arial";
        ctx.fillText("Epoch", legendX, legendY + 16);

        legendY += 30;

        legendEpoch.forEach(function (ep) {
            if (ep.show === true) {
                ctx.fillStyle = ep.color;
                ctx.fillRect(legendX, legendY, 16, 16);

                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.font = "16px Arial";
                ctx.fillText(ep.name, legendX + 20, legendY + 16);

                legendY += 20;
            }
        })

        legendX += 300;
        legendY = y + 45

        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.font = "16px Arial";
        ctx.fillText("Site type", legendX, legendY + 16);

        legendY += 30;

        legendSiteType.forEach(function (type) {
            if (type.show === true) {
                im = new Image();
                im.src = `${HOST_URL}/web_client/img/monTypes/` + type.img;

                im.onload = function () {
                    ctx.drawImage(im, legendX, legendY, 16, 16);
                };

                im.onload();

                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.font = "16px Arial";
                ctx.fillText(type.name, legendX + 20, legendY + 16);

                legendY += 30;
            }
        })

        var im2 = new Image();
        im2.src = canvas.toDataURL()
        im2.onload = function () {
            canvas.height = legendY;
            ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
        };
        im2.onload();
    }

    function done() {
        callback(null, canvas);
    }

    function layersDone(err, layers) {
        if (err) throw err;
        layers.forEach(function (layer) {
            if (layer && layer.canvas) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });
        drawLegend()
        done();
    }

    function handleTileLayer(layer, callback) {
        // `L.TileLayer.Canvas` was removed in leaflet 1.0
        var isCanvasLayer = (L.TileLayer.Canvas && layer instanceof L.TileLayer.Canvas),
            canvas = document.createElement('canvas');

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        var ctx = canvas.getContext('2d'),
            bounds = map.getPixelBounds(),
            zoom = map.getZoom(),
            tileSize = layer.options.tileSize;

        if (zoom > layer.options.maxZoom ||
            zoom < layer.options.minZoom ||
            // mapbox.tileLayer
            (hasMapbox &&
                layer instanceof L.mapbox.tileLayer && !layer.options.tiles)) {
            return callback();
        }

        var tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor()),
            tiles = [],
            j, i,
            tileQueue = new queue(1);

        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                tiles.push(new L.Point(i, j));
            }
        }

        tiles.forEach(function (tilePoint) {
            var originalTilePoint = tilePoint.clone();

            if (layer._adjustTilePoint) {
                layer._adjustTilePoint(tilePoint);
            }

            var tilePos = originalTilePoint
                .scaleBy(new L.Point(tileSize, tileSize))
                .subtract(bounds.min);

            if (tilePoint.y >= 0) {
                if (isCanvasLayer) {
                    var tile = layer._tiles[tilePoint.x + ':' + tilePoint.y];
                    tileQueue.defer(canvasTile, tile, tilePos, tileSize);
                } else {
                    var url = addCacheString(layer.getTileUrl(tilePoint));
                    tileQueue.defer(loadTile, url, tilePos, tileSize);
                }
            }
        });

        tileQueue.awaitAll(tileQueueFinish);

        function canvasTile(tile, tilePos, tileSize, callback) {
            callback(null, {
                img: tile,
                pos: tilePos,
                size: tileSize
            });
        }

        function loadTile(url, tilePos, tileSize, callback) {
            var im = new Image();
            im.crossOrigin = '';
            im.onload = function () {
                callback(null, {
                    img: this,
                    pos: tilePos,
                    size: tileSize
                });
            };
            im.onerror = function (e) {
                // use canvas instead of errorTileUrl if errorTileUrl get 404
                if (layer.options.errorTileUrl != '' && e.target.errorCheck === undefined) {
                    e.target.errorCheck = true;
                    e.target.src = layer.options.errorTileUrl;
                } else {
                    callback(null, {
                        img: dummycanvas,
                        pos: tilePos,
                        size: tileSize
                    });
                }
            };
            im.src = url;
        }

        function tileQueueFinish(err, data) {
            data.forEach(drawTile);
            callback(null, { canvas: canvas });
        }

        function drawTile(d) {
            ctx.drawImage(d.img, Math.floor(d.pos.x), Math.floor(d.pos.y),
                d.size, d.size);
        }
    }

    function handlePathRoot(root, callback) {
        var bounds = map.getPixelBounds(),
            origin = map.getPixelOrigin(),
            canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        var ctx = canvas.getContext('2d');
        var pos = L.DomUtil.getPosition(root).subtract(bounds.min).add(origin);
        try {
            ctx.drawImage(root, pos.x, pos.y, canvas.width - (pos.x * 2), canvas.height - (pos.y * 2));
            callback(null, {
                canvas: canvas
            });
        } catch(e) {
            console.error('Element could not be drawn on canvas', root); // eslint-disable-line no-console
        }
    }

    function handleMarkerLayer(marker, count, callback) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pixelBounds = map.getPixelBounds(),
            minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y),
            pixelPoint = map.project(marker.getLatLng()),
            isBase64 = /^data\:/.test(marker._icon.src),
            url = isBase64 ? marker.options.icon.options.iconUrl : addCacheString(marker.options.icon.options.iconUrl),
            im = new Image(),
            options = marker.options.icon.options,
            size = options.iconSize,
            pos = pixelPoint.subtract(minPoint);
            // anchor = L.point(options.iconAnchor || size && size.divideBy(2, true));

        const reg = new RegExp(/(\d){1}/, "g");
        var imgTypes = url.match(reg);
        legendEpoch[imgTypes[1]-1].show = true;
        legendSiteType[imgTypes[0]-1].show = true;

        if (size instanceof L.Point) size = [size.x, size.y];

        var x = Math.round(pos.x - size[0] + size[0]/2),
            y = Math.round(pos.y - size[1]/2);

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        im.onload = function () {
            ctx.drawImage(this, x, y, size[0], size[1]);
            ctx.font="16px Arial";
            ctx.fillText(count, x + size[0], y + size[1]);
            callback(null, {
                canvas: canvas
            });
        };

        im.src = url;

        if (isBase64) im.onload();
    }
    
    function handleEsriDymamicLayer(dynamicLayer, callback) {
        var canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
    
        var ctx = canvas.getContext('2d');
    
        var im = new Image();
        im.crossOrigin = '';
        im.src = addCacheString(dynamicLayer._currentImage._image.src);
    
        im.onload = function() {
            ctx.drawImage(im, 0, 0);
            callback(null, {
                canvas: canvas
            });
        };
    }

    function addCacheString(url) {
        // If it's a data URL we don't want to touch this.
        if (isDataURL(url) || url.indexOf('mapbox.com/styles/v1') !== -1) {
            return url;
        }
        return url + ((url.match(/\?/)) ? '&' : '?') + 'cache=' + cacheBusterDate;
    }

    function isDataURL(url) {
        var dataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!url.match(dataURLRegex);
    }

};

},{"d3-queue":2}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3_queue = global.d3_queue || {})));
}(this, function (exports) { 'use strict';

  var version = "2.0.3";

  var slice = [].slice;

  var noabort = {};

  function Queue(size) {
    if (!(size >= 1)) throw new Error;
    this._size = size;
    this._call =
    this._error = null;
    this._tasks = [];
    this._data = [];
    this._waiting =
    this._active =
    this._ended =
    this._start = 0; // inside a synchronous task callback?
  }

  Queue.prototype = queue.prototype = {
    constructor: Queue,
    defer: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      if (this._error != null) return this;
      var t = slice.call(arguments, 1);
      t.push(callback);
      ++this._waiting, this._tasks.push(t);
      poke(this);
      return this;
    },
    abort: function() {
      if (this._error == null) abort(this, new Error("abort"));
      return this;
    },
    await: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = function(error, results) { callback.apply(null, [error].concat(results)); };
      maybeNotify(this);
      return this;
    },
    awaitAll: function(callback) {
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = callback;
      maybeNotify(this);
      return this;
    }
  };

  function poke(q) {
    if (!q._start) try { start(q); } // let the current task complete
    catch (e) { if (q._tasks[q._ended + q._active - 1]) abort(q, e); } // task errored synchronously
  }

  function start(q) {
    while (q._start = q._waiting && q._active < q._size) {
      var i = q._ended + q._active,
          t = q._tasks[i],
          j = t.length - 1,
          c = t[j];
      t[j] = end(q, i);
      --q._waiting, ++q._active;
      t = c.apply(null, t);
      if (!q._tasks[i]) continue; // task finished synchronously
      q._tasks[i] = t || noabort;
    }
  }

  function end(q, i) {
    return function(e, r) {
      if (!q._tasks[i]) return; // ignore multiple callbacks
      --q._active, ++q._ended;
      q._tasks[i] = null;
      if (q._error != null) return; // ignore secondary errors
      if (e != null) {
        abort(q, e);
      } else {
        q._data[i] = r;
        if (q._waiting) poke(q);
        else maybeNotify(q);
      }
    };
  }

  function abort(q, e) {
    var i = q._tasks.length, t;
    q._error = e; // ignore active callbacks
    q._data = undefined; // allow gc
    q._waiting = NaN; // prevent starting

    while (--i >= 0) {
      if (t = q._tasks[i]) {
        q._tasks[i] = null;
        if (t.abort) try { t.abort(); }
        catch (e) { /* ignore */ }
      }
    }

    q._active = NaN; // allow notification
    maybeNotify(q);
  }

  function maybeNotify(q) {
    if (!q._active && q._call) q._call(q._error, q._data);
  }

  function queue(concurrency) {
    return new Queue(arguments.length ? +concurrency : Infinity);
  }

  exports.version = version;
  exports.queue = queue;

}));
},{}]},{},[1])(1)
});