LOAD CSV WITH HEADERS FROM "file:///Tom6.csv" AS line 
WITH line, toFloat(replace(line.X, ",", ".")) as x, toFloat(replace(line.Y, ",", ".")) as y, toInt(line.`Эпоха`) as epoch, 
toInt(line.`Культура`) as culture, toInt(line.`Тип`) as mtype, toInt(line.id) as id 
match (p:Research {id: 166}) 
match (ep:Epoch {id: epoch}) 
match (cul:Culture {id: culture}) 
match (type:MonumentType {id: mtype}) 
match (sprt:SpatialReferenceType {id: 5}) 
create (k:Knowledge {id: 13923 + id, monument_name: line.`Название`, description: line.`Описание`}) 
create (m:Monument {id: 11692 + id}) 
create (spr:SpatialReference {id: 16634 + id, x: x, y: y, date: timestamp()}) 
create (k)-[:belongsto]->(m) 
create (p)-[:has]->(k) 
create (m)-[:has]->(ep) 
create (m)-[:has]->(type) 
create (k)-[:has]->(cul) 
create (spr)-[:has]->(sprt) 
create (m)-[:has]->(spr);