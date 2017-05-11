LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1f7du2dS8WBsVyQabQt_6AmyViR4k8ME3Jsv6aewWsl8/pub?gid=136295889&single=true&output=csv" AS line
WITH line, toInt(line.id) as id, toInt(line.`Date BP`) as date, toInt(line.S1) as S, toInt(line.`Date from 68%`) as bot68, toInt(line.`Date to 68%`) as top68,
  toInt(line.`Date from 95 %`) as bot95, toInt(line.`Date to 95%`) as top95, toFloat(replace(line.N, ",", ".")) as x, toFloat(replace(line.E, ",", ".")) as y

MATCH (m:Monument {id: 13})--(k:Knowledge)--(r:Research {id: 439})
MATCH (cm:CarbonMaterial {name: line.`Sample material`})
MATCH (rcdt:RadiocarbonDateType {id: 2})
MATCH (slg:SludgeGenesis {id: 1})
MATCH (spt:SpatialReferenceType {id: 5})

CREATE (rc:Radiocarbon {id: 814 + id, name: line.`Lab num`, date: date, s: S, bcadFirstBot: bot68, bcadFirstTop: top68, bcadSecondBot: bot95, bcadSecondTop: top95,
  excRegion: line.`Место обнаружения (участок, квадрат)`, sampleDesc: line.`Описание образца`})
CREATE (sp:SpatialReference {id: 17433 + id, date: timestamp(), x: x, y: y})

CREATE (rc)-[:has]->(rcdt),
  (rc)-[:has]->(slg),
  (rc)-[:has]->(cm),
  (sp)-[:has]->(spt),
  (rc)-[:has]->(sp),
  (k)-[:has]->(rc),
  (r)-[:has]->(rc);


MATCH (m:Monument {id: 13}) MATCH (r:Research {id: 439}) MATCH (c:Culture {id: 8}) create (k:Knowledge {id: 1, monument_name: "Городище Великие Болгары"}) create (k)-[:has]->(c), (r)-[:has]->(k), (k)-[:belongsto]->(m);