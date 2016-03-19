'use strict';

App.views.search = new (App.View.extend({
  'index': function() {
    App.page.get('authorByName').on('autocompleteselect', function(event, ui) {
      $('#research-author-id').val(ui.item.id);
      
    });
    
    function makeRequest($dataDiv) {
      _.each($dataDiv.find('input'), function(input) {
	
      });
    }
    
    var $submit = $('#search-submit');
    $submit.on('click', function() {
      $submit.prop('disabled', true);

      
    });
  }
}));

/*
create (a1:Author {id:1, name:'Первый'})
create (a2:Author {id:2, name:'Второй'})
create (a3:Author {id:3, name:'Третий'})
create (r1:Research {id:1, year: 1999, description: 'r1'})
create (r2:Research {id:2, year: 1999, description: 'r2'})
create (r3:Research {id:3, year: 2000, description: 'r2'})
create (r4:Research {id:4, year: 2000, description: 'r2'})
create (r5:Research {id:4, year: 2001, description: 'r3'})
create (a1)-[:Created]->(r1)
create (a1)-[:Created]->(r2)
create (a1)-[:Created]->(r3)
create (a2)-[:Created]->(r4)
create (a3)-[:Created]->(r5)
        
profile 
match (a:Author {id:1})
match (r:Research)
match (a)-[:Created]->(r)
where r.year = 1999
return r

profile 
match (a:Author)
match (r:Research)
match (a)-[:Created]->(r)
where a.name starts with 'Пер'
  and r.year = 1999
return r
*/
