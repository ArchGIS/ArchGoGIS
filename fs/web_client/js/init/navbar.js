'use strict';


App.template.get('navbar', function (tmpl) {
  const lang = App.locale.getLang();
  App.locale.set(lang);
  $('#navigation').replaceWith(tmpl());

  const en = 'en';
  const ru = 'ru';
  const path = '/web_client/img/flags/';
  const current = lang === en ? `<img height="16px" src="${path}ru.png"> Русский` : `<img height="16px" src="${path}en.png"> English`;
  $('#set_language').html(current);

  $('#set_language').on('click', function (event) {
    event.preventDefault();
    
    const change = lang === en ? ru : en;

    App.locale.set(change);
    $('#navigation').replaceWith(tmpl());

    App.store.mapTypes = {
      monument: App.locale.translate('monument.plural'),
      excavation: App.locale.translate('excavation.plural'),
      heritage: App.locale.translate('heritage.singular'),
      research: App.locale.translate('research.plural'),
      artifact: App.locale.translate('artifact.plural'),
      radiocarbon: App.locale.translate('radiocarbon.plural')
    };

    location.reload();
  });
});