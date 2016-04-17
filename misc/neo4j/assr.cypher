CREATE (am:ArchMap {
  id:1,
  name:"Археологическая карта Татарской АССР - Западное Закамье"
})

CREATE (pub:Publisher {
  id:1,
  name:"Полиграфический комбинат им. К. Якуба",
  town:"Казань"
})

CREATE (col:Collection {id:1})

CREATE (org:Organization {
  id:1,
  name:"Археологический кабинет Института истории им. Г. Ибрагимова КФАН СССР"
})

CREATE (pub)-[:Published {year:1986}]->(am)
CREATE (org)-[:Stores {n:"435",since:1990}]->(col)
