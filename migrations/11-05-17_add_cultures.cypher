LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/13szU9Dv_xyLnD2sTdEsGzBMS6uCf6rJdeJ3LT9r73_A/pub?gid=870182525&single=true&output=csv" AS line
WITH line, toInt(line.`ID памятника`) as mid, toInt(line.`ID исследования`) as rid, toInt(line.`ID культуры`) as cid
MATCH (m:Monument {id: mid})--(k:Knowledge)--(r:Research {id: rid})
MATCH (c:Culture {id: cid})
CREATE (k)-[:has]->(c);