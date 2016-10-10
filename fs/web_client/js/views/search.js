'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    var t = App.locale.translate;
    var grepObject = App.fn.grepObject;
    
    var $results = $('#results');
    var $resultsCount = $('#results-count');

    var resultProvider = null;
    var $objectToggler = App.page.get('objectToggler');
    var object = null;
    var objects = {
      'monument-params': {
        'handler': searchMonument,
        'heading': ['#', t('monument.prop.type'), t('monument.prop.epoch')],
        'columnsMaker': function(monuments) {
          return _.map(monuments, function(mk, n) {
            return [
              App.models.Monument.href(mk[0].id, n+1),
              t('monument.types')[+mk[2]],
              t('epoch')[mk[3] - 1]
            ];
          });
        },
        'inputs': {'monument': App.page.get('monument-input')}
      },
      'research-params': {
        'handler': searchResearch,
        'heading': ['#', t('research.prop.description'), t('research.prop.type')],
        'columnsMaker': function(researches) {
          return _.map(researches, function(r, n) {
            return [App.models.Research.href(r.id, n+1), r.description, r.type];
          });
        },
        'inputs': {
          'author': App.page.get('research-author-input'),
          '$year': $('#research-year-input') 
        }
      },
      'author-params': {
        'handler': searchAuthor,
        'heading': ['#', t('author.prop.name'), t('author.prop.year')],
        'columnsMaker': function(authors) {
          return _.map(authors, function(a, n) {
            return [App.models.Author.href(a.id, n+1), a.name, a.year];
          });
        },
        'inputs': {'author': App.page.get('author-input')}
      },
      'report-params': {
        'handler': searchReport,
        'heading': ['#', t('report.prop.description'), t('report.prop.type')],
        'columnsMaker': function(reports) {
          return _.map(reports, function(r, n) {
            return [App.models.Report.href(r.id, n+1), r.description, r.type];
          });
        },
        'inputs': {
          'author': App.page.get('report-author-input'),
          '$year': $('#report-year-input') 
        }
      }
    };

    $('#show-results-button').on('click', showResults);
    
    // Заполнение и отрисовка таблицы результатов.
    function showResults() {
      $('#body :input').prop('disabled', true);
      
      App.page.get('resultsTable')
        .setHead(object.heading)
        .setBody(object.columnsMaker(resultProvider()));
                 
      $('#results-table-box').show();
    }

    // Смена искомого объекта.
    $objectToggler.setCallback(function($object) {
      object = objects[$object.prop('id')];
      object.handler(object);
    });
    object = objects['monument-params'];
    object.handler(object);

    // Поиск памятника
    function searchMonument(my) {
      var monuments = [];
      resultProvider = () => monuments;

      my.inputs.monument.on('autocompleteselect', function(event, ui) {
        $results.show();
        
        // #FIXME: это очень плохое преобразование данных.
        var records = my.inputs.monument.getRecords();
        var matcher = new RegExp('^' + ui.item.label);
        monuments = _.filter(records, function(record) {
          return matcher.test(record[1].monument_name);
        });

        $resultsCount.html(monuments.length);
      });
    }

    // Поиск автора
    function searchAuthor(my) {
      var authors = [];
      resultProvider = () => authors;

      my.inputs.author.on('autocompleteselect', function(event, ui) {
        $results.show();
        authors = grepObject('^' + ui.item.label, my.inputs.author.getRecords(), 'name');
        $resultsCount.html(authors.length);     
      });
    }

    // Поиск исследования
    function searchResearch(my) {
      var researches = [];
      var filteredResearches = [];
      resultProvider = () => filteredResearches;
     
      function handleAuthorSelect(event, ui) {
        App.models.Research.findByAuthorId(ui.item.id).then(function(researches) {
          
          my.inputs.$year.autocomplete({
            'minLength': 0,
            'source': _.map(_.uniq(researches, 'year'), function(research) {
              return {'label': research.year, 'id': research.id}
            })
          })
          .on('focus', () => my.inputs.$year.autocomplete('search'))
          .on('autocompleteselect', function(event, ui) {
            $results.show();
            filteredResearches = _.filter(researches, r => r.year == ui.item.label);
            $resultsCount.html(filteredResearches.length);
          });
        });
      }
      
      my.inputs.author.on('autocompleteselect', handleAuthorSelect);
    }

    function searchReport(my) {
      var reports = [];
      var filteredReport = [];
      resultProvider = () => filteredReport;
     
      function handleAuthorSelect(event, ui) {
        App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
          
          my.inputs.$year.autocomplete({
            'minLength': 0,
            'source': _.map(_.uniq(reports, 'year'), function(report) {
              return {'label': report.year, 'id': report.id}
            })
          })
          .on('focus', () => my.inputs.$year.autocomplete('search'))
          .on('autocompleteselect', function(event, ui) {
            $results.show();
            filteredReport = _.filter(reports, r => r.year == ui.item.label);
            $resultsCount.html(filteredReport.length);
          });
        });
      }
      
      my.inputs.author.on('autocompleteselect', handleAuthorSelect);
    }
  }
}));
