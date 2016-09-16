CREATE (t:Town {name:"Казань"})

CREATE (pub:Publisher {
  id:1,
  name:"Полиграфический комбинат им. К. Якуба"
})
CREATE (pub)-[:LocatedAt]->(t)

CREATE (org:Organization {
  id:1,
  name:"Археологический кабинет Института истории им. Г. Ибрагимова КФАН СССР"
})
CREATE (org)-[:LocatedAt]->(t)

CREATE (a:Author {id:1, name:"Старостин П.Н."})
CREATE (r:Research {id:1, year:1985, description: "Памятники Западного Закамья Татарской АССР"})
CREATE (a)-[:Created]->(r)

CREATE (l:Literature {id:1, name:"Археологическая карта Татарской АССР - Западное Закамье"})
CREATE (r)-[:Has]->(l)
CREATE (org)-[:Stores {since: 1990, n:"435"}]->(l)
CREATE (pub)-[:Published {year: 1990}]->(l)
