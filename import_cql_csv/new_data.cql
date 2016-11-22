LOAD CSV WITH HEADERS FROM "file:///Bolgar_trenches.csv" AS line
WITH line, toInt(line.ResYear) as resYear, toInt(line.RepYear) as repYear, toFloat(line.ExcArea) as excArea, toInt(line.Index) as index
MERGE (author:Author {name: line.ResAuthor})
  ON CREATE SET author.id = 99999999999999 - index
MERGE (res:Research {year: resYear})
	ON CREATE SET res.name = line.ResName, res.id = 99999999999999 - index
MERGE (res)-[:hasauthor]->(author)
MERGE (res)-[:has]->(k:Knowledge {monument_name: line.MonName})-[:belongsto]->(m:Monument)
  ON CREATE SET m.id = 99999999999999 - index, k.id = 99999999999999 - index 
MERGE (res)-[:has]->(rep:Report {name: coalesce(line.RepName, ""), year: coalesce(repYear, ""), number: coalesce(line.RepNum, "")})-[:hasauthor]->(author)
  ON CREATE SET rep.id = 99999999999999 - index
MERGE (org:Organisation {name: coalesce(line.RepStorage, "")})
  ON CREATE SET org.id = 99999999999999 - index
MERGE (rep)-[:in]->(org)
MERGE (city:City {name: coalesce(line.RepCity, "")})
MERGE (org)-[:has]->(city)
CREATE (res)-[:has]->(exc:Excavation {id: 99999999999999 - index, name: line.ExcName, boss: line.ExcBoss, area: excArea, x: line.N, y: line.E})<-[:has]-(m)
;

LOAD CSV WITH HEADERS FROM "file:///new_mons.csv" AS line
WITH line, toInt(line.Index) as index
MERGE (k:Knowledge {monument_name: line.MonName})-[:belongsto]->(mon:Monument)
  ON CREATE SET k.x = line.N, k.y = line.E, k.id = 9999999999999 + index
  ON MATCH SET k.x = line.N, k.y = line.E
MERGE (mt:MonumentType {name: line.MonType})
  ON CREATE SET mt.id = 10 + index 
MERGE (mon)-[:has]->(mt)
MERGE (epoch:Epoch {name: line.Epoch})
MERGE (mon)-[:has]->(epoch)
MERGE (her:Heritage {name: line.Herit})
MERGE (her)-[:has]->(mon)
;
