LOAD CSV WITH HEADERS FROM "file:///monuments.csv" AS line

WITH line

CREATE (k:Knowledge {monument_name: line.Name, description: line.Description})
CREATE (m:Monument)
CREATE (k)-[:belongsto]->(m)

RETURN k.monument_name