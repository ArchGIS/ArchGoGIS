'use strict';

App.views.excavation = new (Backbone.View.extend({
  "show": function(placemarks) {
    const types       = _.uniq( _.pluck(placemarks, 'type') ),
          mapInstance = App.views.map(types),
          map         = mapInstance.map,
          overlays    = mapInstance.overlayLayers;

    _.each(placemarks, function(item) {
      if (!item.coords[0] && !item.coords[1]) { return; }
      
      const pathToIcon = `/web_client/img/${App.store.pathToIcons[item.type]}`;
      const icon = L.icon({
        iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
        iconSize: [16, 16]
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

    $('.tabs').tabs();
    App.views.functions.setAccordion(".accordion");
  },
}));
