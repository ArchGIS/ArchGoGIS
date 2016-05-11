CREATE (am:ArchMap {
  id:1,
  name:"Археологическая карта Татарской АССР - Западное Закамье"
})

CREATE (am2:ArchMap {
  id:2,
  name:"Ещё одна археологическая карта"
})

CREATE (pub:Publisher {
  id:1,
  name:"Полиграфический комбинат им. К. Якуба",
  town:"Казань"
})

CREATE (au:Author {
  name:"Автор А.И."
})

CREATE (col:Collection {id:1})

CREATE (org:Organization {
  id:1,
  name:"Археологический кабинет Института истории им. Г. Ибрагимова КФАН СССР"
})

CREATE (pub)-[:Published {year:1986}]->(am)
CREATE (pub)-[:Published {year:1999}]->(am)
CREATE (org)-[:Stores {n:"435",since:1990}]->(col)
CREATE (au)-[:Created]->(am)
CREATE (au)-[:Created]->(am2)