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

  "getMonPlacemarks": function(data, single) {
    let placemarks = [], spatref, monName,
        type, epoch, preset, monId, knows;

    single = single || false;

    let spatrefs = (single) ? {sr: {monSpatref: data.monSpatref, monSpatrefT: data.monSpatrefT}} : data.monSpatref;
    _.each(spatrefs, function(monSpatrefs, i) {
      monId = (single) ? data.monuments.id : data.monuments[i].id;
      knows = (single) ? data.knowledges : data.knowledges[i];

      spatref = App.fn.findActualSpatref(monSpatrefs.monSpatref, monSpatrefs.monSpatrefT);

      if (Array.isArray(knows)) {
        monName = App.utils.monumentFn.chooseMonumentName(
          _.map(knows, (obj) => {return obj.monument_name})
        );
      } else {
        monName = knows.monument_name;
      }

      if (spatref.date > 0) {
        type = (single) ? data.monTypes[0].id : data.monTypes[i][0].id || 11;
        epoch = (single) ? data.epochs[0].id : data.epochs[i][0].id || 8;
        preset = `monType${type}_${epoch}`;

        placemarks.push(
          App.controllers.fn.createStandartPlacemark('monument', monId, spatref.x, spatref.y, monName, preset)
        );
      }
    })

    return placemarks;
  },

  "getResPlacemarks": function(data) {
    let placemarks = [], spatref, found, authorName, resHeader, monKey,
        resType, resTypeId, preset, resId, resYear, area;

    _.each(data.researches, function(research, i) {
      resId = research.id;
      authorName = (data.author) ? data.author.name : data.authors[i].name;
      resType = (data.resTypes[0].name) ? data.resTypes[0].name : data.resTypes[i][0].name;
      resTypeId = data.resTypes[i][0].id || 1;
      resYear = research.year || "Год неизвестен";
      resHeader = `${authorName}, ${resType} (${resYear})`;
      preset = `resType${resTypeId}`;

      found = false;
      spatref = {area: -1};

      _.each(data.excavations[i].excavations, function(exc, t) {
        area = exc.area || 0;
        if (area > spatref.area) {
          found = true; 
          spatref.area = area;
          spatref.x = data.excavations[i].excSpatref[t].x;
          spatref.y = data.excavations[i].excSpatref[t].y;
        }
      })

      if (found === false) {
        if (data.resMonuments) {
          _.each(data.resMonuments[i], function(mon, t) {
            monKey = _.findIndex(data.monuments, (m) => {return m.id == mon.id});
            found = true;
            spatref = App.fn.findActualSpatref(
              data.monSpatref[monKey].monSpatref, 
              data.monSpatref[monKey].monSpatrefT
            );
          })
        } else {
          found = true;
          spatref = App.fn.findActualSpatref(
            data.monSpatref, 
            data.monSpatrefT
          );
        }
      }

      if (found) {
        placemarks.push(
          App.controllers.fn.createStandartPlacemark('research', resId, spatref.x, spatref.y, resHeader, preset)
        );
      }
    });

    console.log(placemarks)
    return placemarks;
  },

  "getHerPlacemarks": function(data, single) {
    let placemarks = [], spatref, heritage, preset;
    single = single || false;

    if (single) {
      placemarks.push(
        App.controllers.fn.createStandartPlacemark(
          'heritage', data.heritage.id, data.herSpatref[0].x, 
          data.herSpatref[0].y, data.heritage.name, 'heritage'
        )
      );
    } else {
      _.each(data.heritages, function(h, hId) {
        heritage = h.heritage[0];
        spatref = App.fn.findActualSpatref(
          h.herSpatref, 
          h.herSpatrefT
        );

        if (spatref.date > 0) {
          placemarks.push(
            App.controllers.fn.createStandartPlacemark('heritage', heritage.id, spatref.x, spatref.y, heritage.name, 'heritage')
          );
        }
      })
    }

    console.log(placemarks)
    return placemarks;
  },

  "getExcPlacemarks": function(data, single) {
    let placemarks = [], spatref = {}, excHeader,
        excType, preset, resYear, area;
    single = single || false;

    if (single && data.excavation && data.researches[0]) {
      area = data.excavation.area || 0;
      excType = (area <= 20) ? 1 : 2;
      preset = `excType${excType}`;
      resYear = data.researches[0].year;
      excHeader = `${data.excavation.name} (${resYear})`;

      placemarks.push(
        App.controllers.fn.createStandartPlacemark(
          'excavation', data.excavation.id, data.excSpatref[0].x, 
          data.excSpatref[0].y, excHeader, preset
        )
      );
    } else {
      _.each(data.excavations, function(excs, i) {
        _.each(excs, function(exc, t) {
          area = exc.area || 0;
          resYear = (data.research) ? data.research.year : data.researches[i].year;
          excHeader = `${exc.name} (${resYear})`;
          excType = (area <= 20) ? 1 : 2;
          preset = `excType${excType}`;

          _.each(data.excSpatref[i].excSpatref, function(excSpatref, p) {
            spatref.x = excSpatref.x, 
            spatref.y = excSpatref.y

            placemarks.push(
              App.controllers.fn.createStandartPlacemark('excavation', exc.id, spatref.x, spatref.y, excHeader, preset)
            );
          })
          console.log(spatref)
          
        })
      });
    }

    console.log(placemarks)
    return placemarks;
  },

  "getArtPlacemarks": function(data, single) {
    let placemarks = [], spatref = {}, artHeader, preset;
    single = single || false;

    if (single) {
      artHeader = `${data.artifact.name}`;
      preset = `artifact`;

      if (data.artiSpatref.length) {
        spatref.x = data.artiSpatref[0].x;
        spatref.y = data.artiSpatref[0].y;
      } else if (data.excSpatref.length) {
        spatref = App.fn.findActualSpatref(
          data.excSpatref,
          data.excSpatrefT
        );
      } else {
        spatref = App.fn.findActualSpatref(
          data.monSpatref[0].monSpatref, 
          data.monSpatref[0].monSpatrefT
        );
      }

      placemarks.push(
        App.controllers.fn.createStandartPlacemark(
          'artifact', data.artifact.id, spatref.x, 
          spatref.y, artHeader, preset
        )
      );
    } else {
      _.each(data.artiSpatref, function(art, i) {
        artHeader = `${data.artifacts[i].name}`;
        preset = `artifact`;

        spatref = App.fn.findActualSpatref(
          art.artiSpatref, 
          art.artiSpatrefT
        );

        if (spatref.date === 0) {
          spatref = App.fn.findActualSpatref(
            data.artiExcSpatref[i].artiExcSpatref, 
            data.artiExcSpatref[i].artiExcSpatrefT
          );
        }

        if (spatref.date === 0) {
          spatref = App.fn.findActualSpatref(
            data.artiMonSpatref[i].artiMonSpatref, 
            data.artiMonSpatref[i].artiMonSpatrefT
          );
        }

        placemarks.push(
          App.controllers.fn.createStandartPlacemark('artifact', art.id, spatref.x, spatref.y, artHeader, preset)
        );
      });
    }

    console.log(placemarks)
    return placemarks;
  },
}