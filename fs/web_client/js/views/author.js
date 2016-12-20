'use strict';

App.views.author = new (Backbone.View.extend({
  'show': (placemarks) => {
    const types       = _.uniq( _.pluck(placemarks, 'type') ),
          mapInstance = App.views.map(types),
          map         = mapInstance.map,
          overlays    = mapInstance.overlayLayers;

    _.each(placemarks, function(item) {
      const pathToIcon = `/web_client/img/${item.type.indexOf('Памятник') !== -1  ? 'monTypes' : 'excTypes'}`;
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
        location.hash = `monument/show/${item.id}`
      });

      overlays[item.type].addLayer(marker);
    });

    App.views.functions.setAccordion("#accordion");
    $('.tabs').tabs();
  }
}));