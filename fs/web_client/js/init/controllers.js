'use strict';

App.controllers.fn = {
  "createStandartPlacemark": function(type, id, x, y, content, preset) {
    return {
      type: type,
      id: id,
      coords: [x, y],
      pref: {
        hintContent: content
      },
      opts: {
        preset: preset
      }
    }
  },

  "getMonPlacemarks": function(data) {
    let placemarks = [], spatref, monName,
        type, epoch, preset;

    _.each(data.monSpatref, function(monSpatrefs, i) {
      spatref = {
        date: 0, 
        type: 6, 
      };

      _.each(monSpatrefs.monSpatref, function(coord, t) {
        if ((monSpatrefs.monSpatrefT[t].id < spatref.type) || 
          ((monSpatrefs.monSpatrefT[t].id == spatref.type) && (coord.date > spatref.date))) {

          spatref.x = coord.x;
          spatref.y = coord.y;
          spatref.date = coord.date;
          spatref.type = monSpatrefs.monSpatrefT[t].id;
        }
      })

      if (typeof data.knowledges[i] === "array") {
        monName = App.utils.monumentFn.chooseMonumentName(
          _.map(data.knowledges[i], (obj) => {obj.monument_name})
        );
      } else {
        monName = data.knowledges[i].monument_name;
      }

      if (spatref.date > 0) {
        type = data.monTypes[i][0].id || 11;
        epoch = data.epochs[i][0].id || 8;
        console.log(type, epoch)
        preset = `monType${type}_${epoch}`;
        placemarks.push(
          App.controllers.fn.createStandartPlacemark('monument', data.monuments[i].id, spatref.x, spatref.y, monName, preset)
        );
      }
    })

    console.log(placemarks);
    return placemarks;
  }
}