match (m:Monument)
match (spt:SpatialReferenceType {id: 5})
match (m)--(k:Knowledge) 
optional match (m)-[:has]->(sp:SpatialReference) 
with collect(m) as ml, m, count(sp) as sp, k, collect(k) as kl, range(5792, 7171) as ids 
where sp = 0 
foreach (v in kl | 
  MERGE (iden:Counter) 
  ON CREATE SET iden.count = 0 
  ON MATCH SET iden.count = iden.count + 1 
  
  merge (sprt:SpatialReference {id: ids[iden.count], date: timestamp()}) 
  ON CREATE SET sprt.x = k.x, sprt.y = k.y 
  
  CREATE (m)-[:has]->(sprt)-[:has]->(spt)
);

match (e:Excavation)
match (spt:SpatialReferenceType {id: 5}) 
optional match (e)-[:has]->(sp:SpatialReference) 
with collect(e) as el, e, count(sp) as spc, range(117, 194) as ids 
where spc = 0 
foreach (v in el | 
  MERGE (iden:Counter1) 
  ON CREATE SET iden.count = 0 
  ON MATCH SET iden.count = iden.count + 1 
  
  merge (sprt:SpatialReference {id: ids[iden.count], date: timestamp()}) 
  ON CREATE SET sprt.x = e.x, sprt.y = e.y 
  
  CREATE (e)-[:has]->(sprt)
  CREATE (sprt)-[:has]->(spt)
);

match (a:Artifact) where a.x is not null match (spt:SpatialReferenceType {id: 5}) with collect(a) as al, a, range(7192, 7232) as ids foreach (v IN al | MERGE (ident:CounterArt) ON CREATE SET ident.count = 0 ON MATCH SET ident.count = ident.count + 1 MERGE (sprt:SpatialReference {id: ids[ident.count], date: timestamp()}) ON CREATE SET sprt.x = a.x, sprt.y = a.y CREATE (a)-[:has]->(sprt) CREATE (sprt)-[:has]->(spt))

match (p:Publication) match (rt:ResearchType {id: 3}) optional match (p)-[rel]-(r:Research) with p, rt, count(r) as rc where rc = 0 with p, rt, collect(p) as pl, range(130, 237) as ids foreach(v IN pl | MERGE (ident:CounterR) ON CREATE SET ident.count = 0 ON MATCH SET ident.count = ident.count + 1 MERGE (res:Research {id: ids[ident.count]}) ON CREATE SET res.name = p.name, res.year = p.published_at CREATE (res)-[:has]->(p) CREATE (res)-[:has]->(rt));