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

LOAD CSV WITH HEADERS FROM "file:///Tom_4.csv" AS line WITH line, toFloat(line.x) as x, toFloat(line.y) as y, toInt(line.epoch) as epoch, toInt(line.culture) as culture, toInt(line.second) as second, toInt(line.type) as mtype, toInt(line.id) as id match (p:Research {id: 126}) match (ep:Epoch {id: epoch}) match (cul:Culture {id: culture}) match (type:MonumentType {id: mtype}) match (sprt:SpatialReferenceType {id: 5}) create (k:Knowledge {id: 2986 + id, monument_name: line.name, description: line.descr}) create (m:Monument {id: 2842 + id}) create (spr:SpatialReference {id: 7570 + id, x: x, y: y, time: timestamp()}) create (k)-[:belongsto]->(m) create (p)-[:has]->(k) create (m)-[:has]->(ep) create (m)-[:has]->(type) create (k)-[:has]->(cul) create (spr)-[:has]->(sprt) create (m)-[:has]->(spr);


LOAD CSV WITH HEADERS FROM "file:///okn3.csv" AS line
WITH line, toFloat(line.x) as x, toFloat(line.y) as y, toInt(line.status) as status, toInt(line.id) as id
match (hs:HeritageStatus {id: status})
match (sprt:SpatialReferenceType {id: 5})
create (h:Heritage {id: id + 44 + 1967 + 201, name: line.name, address: line.addr, date: line.dat})
create (sp:SpatialReference {id: id + 3542 + 1967 + 201, x: x, y: y, time: timestamp()})
create (h)-[:has]->(hs)
create (sp)-[:has]->(sprt)
create (h)-[:has]->(sp);

LOAD CSV WITH HEADERS FROM "file:///okn3.csv" AS line
WITH line, toFloat(line.x) as x, toFloat(line.y) as y, toInt(line.status) as status, toInt(line.id) as id
match (h:Heritage {name: line.name})
match (f:File {id: 4})
create (h)-[:has]->(f);


### Последний вариант для добавления памятников тома 4
LOAD CSV WITH HEADERS FROM "file:///Tom_4.csv" AS line WITH line, toFloat(line.x) as x, toFloat(line.y) as y, toInt(line.epoch) as epoch, toInt(line.culture) as culture, toInt(line.second) as second, toInt(line.type) as mtype, toInt(line.id) as id match (p:Research {id: 126}) match (ep:Epoch {id: epoch}) match (cul:Culture {id: culture}) match (type:MonumentType {id: mtype}) match (sprt:SpatialReferenceType {id: 5}) create (k:Knowledge {id: 2986 + id, monument_name: line.name, description: line.descr}) create (m:Monument {id: 2842 + id}) create (spr:SpatialReference {id: 7570 + id, x: x, y: y, time: timestamp()}) create (k)-[:belongsto]->(m) create (p)-[:has]->(k) create (m)-[:has]->(ep) create (m)-[:has]->(type) create (k)-[:has]->(cul) create (spr)-[:has]->(sprt) create (m)-[:has]->(spr) FOREACH (ign IN CASE WHEN second IS NOT NULL THEN [1] ELSE [] END | merge (sec:Culture {id: second}) create (k)-[:has]->(sec));
