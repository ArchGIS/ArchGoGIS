LOAD CSV WITH HEADERS FROM "file:///Tom_3.csv" AS line
WITH line, toFloat(line.x) as x, toFloat(line.y) as y, toInt(line.epoch) as epoch, toInt(line.culture) as culture, toInt(line.second) as second, toInt(line.type) as mtype, toInt(line.id) as id
match (p:Research {id: 114})
match (ep:Epoch {id: epoch})
match (cul:Culture {id: culture})
match (type:MonumentType {id: mtype})
match (sprt:SpatialReferenceType {id: 5})
create (k:Knowledge {id: 1958 + id, monument_name: line.name, description: line.descr})
create (m:Monument {id: 1897 + id})
create (spr:SpatialReference {id: 1625 + id, x: x, y: y, time: timestamp()})
create (k)-[:belongsto]->(m)
create (p)-[:has]->(k)
create (m)-[:has]->(ep)
create (m)-[:has]->(type)
create (k)-[:has]->(cul)
create (spr)-[:has]->(sprt)
create (m)-[:has]->(spr)
return k.monument_name;
