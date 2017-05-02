LOAD CSV WITH HEADERS FROM "file:///Late_Sarmatians.csv" AS line 
WITH line, toFloat(replace(line.N, ",", ".")) as x, toFloat(replace(line.E, ",", ".")) as y, toInt(line.id) as id 
match (p:Research {id: 414}) 
match (ep:Epoch {id: 3}) 
match (cul:Culture {id: 177}) 
match (type:MonumentType {id: 5}) 
match (sprt:SpatialReferenceType {id: 4}) 
create (k:Knowledge {id: 14096 + id, monument_name: line.`Название`, dateBottom: line.`Дата от`, dateTop: line.`Дата до`})
FOREACH(ign IN CASE WHEN line.`Описание` IS NOT NULL THEN [1] ELSE [] END |
  SET k.description = line.`Описание`
) 
create (m:Monument {id: 11803 + id}) 
FOREACH(ign IN CASE WHEN x IS NOT NULL THEN [1] ELSE [] END |
  create (spr:SpatialReference {id: 16824 + id, x: x, y: y, date: timestamp()})
  create (spr)-[:has]->(sprt) 
  create (m)-[:has]->(spr)
)
create (k)-[:belongsto]->(m) 
create (p)-[:has]->(k) 
create (m)-[:has]->(ep) 
create (m)-[:has]->(type) 
create (k)-[:has]->(cul) 
;