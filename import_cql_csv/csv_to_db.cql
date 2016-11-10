LOAD CSV WITH HEADERS FROM "file:///TRefMonType.csv" AS line
WITH line, toInt(line.IDMonType) as id
CREATE (mt:MonumentType {id: id, name: line.MonType});

LOAD CSV WITH HEADERS FROM "file:///TRefState.csv" AS line
WITH line, toInt(line.IDState) as id
CREATE (st:State {id: id, name: line.StateName});

LOAD CSV WITH HEADERS FROM "file:///TRefRegion.csv" AS line
WITH line, toInt(line.IDRegion) as idReg, toInt(line.IDState) as idSt
MATCH (st:State {id: idSt})
CREATE (region:Region {id: idReg, name: line.RegionName})
CREATE (st)-[:has]->(region);

LOAD CSV WITH HEADERS FROM "file:///TMonument.csv" AS line
WITH line, toInt(line.IDRegion) as idReg, toInt(line.IDMonType) as idMT, toInt(line.IDMonument) as idMon, toInt(line.MonNumber) as monNum
MATCH (mt:MonumentType {id: idMT})
MATCH (region:Region {id: idReg})
CREATE (mon:Monument {id: 99999999999999 + idMon, number: monNum})
CREATE (k:Temp {id: 99999999999999 + idMon, monument_name: line.MonName, description: line.MonDescription, x: line.MonDecimalLatitude, y: line.MonDecimalLongitude})
CREATE (mon)-[:has]->(mt)
CREATE (mon)-[:in]->(region);


LOAD CSV WITH HEADERS FROM "file:///TRefResType.csv" AS line
WITH line, toInt(line.IDResType) AS id
CREATE (:ResearchType {id: id, name: line.ResTypeName});

LOAD CSV WITH HEADERS FROM "file:///TRefAutor.csv" AS line
WITH line, toInt(line.IDAutor) AS id
FOREACH(ign IN CASE WHEN NOT line.AutorName =~ '.*,.*' THEN [1] ELSE [] END | CREATE (a:Author {id: 99999999999999 + id, name: line.AutorName}))
FOREACH(ign IN CASE WHEN line.AutorName =~ '.*,.*' THEN [1] ELSE [] END |
  CREATE (atmp:AuTemp {id: 99999999999999 + id, autIds: split(line.AutorName, ", ")})
);

LOAD CSV WITH HEADERS FROM "file:///TResearching.csv" AS line
WITH line, toInt(line.IDAutor) AS idAut, toInt(line.IDMonument) AS idKnow, toInt(line.IDResearching) AS idRes, toInt(line.ResYear) AS resYear, toInt(line.IDResType) AS idType

MATCH (rt:ResearchType {id: idType})
MATCH (t:Temp {id: 99999999999999 + idKnow})
MATCH (m:Monument {id: 99999999999999 + idKnow})

OPTIONAL MATCH (a:Author {id: 99999999999999 + idAut})
OPTIONAL MATCH (c:AuTemp {id: 99999999999999 + idAut})

FOREACH(ign IN CASE WHEN a IS NOT NULL AND resYear IS NOT NULL THEN [1] ELSE [] END |
  MERGE (rt)<-[:has]-(res:Research {year: resYear})-[:hasauthor]->(a)
  ON CREATE SET res.id = 99999999999999 + idRes,
    res.name = toString(rt.name + ' ' + resYear) + ' (' + toString(a.name + ' ' + resYear) + ')'

  CREATE (res)-[:has]->(k:Knowledge {id: 99999999999999 + idKnow, monument_name: t.monument_name, description: t.description, x: t.x, y: t.y})-[:belongsto]->(m)
)

FOREACH (ign IN CASE WHEN c IS NOT NULL AND resYear IS NOT NULL THEN [1] ELSE [] END |
  MERGE (author:Author {name: head(c.autIds)})
  MERGE (rt)<-[:has]-(res:Research {year: resYear})-[:hasauthor]->(author)
  ON CREATE SET res.id = 99999999999999 + idRes,
    res.name = toString(rt.name + ' ' + resYear) + ' (' + toString(author.name + ' ' + resYear) + ')'

  FOREACH (val IN tail(c.autIds) |
    MERGE (coaut:Author {name: val})
    MERGE (res)-[:hascoauthor]->(coaut)
  )

  CREATE (res)-[:has]->(k:Knowledge {id: 99999999999999 + idKnow, monument_name: t.monument_name, description: t.description, x: t.x, y: t.y})-[:belongsto]->(m)
);



LOAD CSV WITH HEADERS FROM "file:///TRefCulture.csv" AS line
WITH line, toInt(line.IDCulture) as idCulture
CREATE (c:Culture {id: idCulture, name: line.CultureName});

LOAD CSV WITH HEADERS FROM "file:///TRefCultureLayer.csv" AS line
WITH line, toInt(line.IDCultureLayer) as id
CREATE (e:Epoch {id: id, name: line.CultureLayer});


LOAD CSV WITH HEADERS FROM "file:///TRefPubPlace.csv" AS line
WITH line, toInt(line.IDPubPlace) as id
CREATE (city:City {id: id, name: line.PubPlaceName});

LOAD CSV WITH HEADERS FROM "file:///TRefStorePlace.csv" AS line
WITH line, toInt(line.IDStorePlace) as id
CREATE (org:Organisation {id: 99999999999999 + id, name: line.StorePlaceName});


LOAD CSV WITH HEADERS FROM "file:///TRefReport.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.IDPubPlace) as idPlace, toInt(line.IDStorePlace) as idOrg, toInt(line.IDReport) as idRep, toInt(line.RepYear) as repYear
MATCH (aut:Author {id: 99999999999999 + idAut})
MATCH (city:City {id: idPlace})
MATCH (org:Organisation {id: 99999999999999 + idOrg})
CREATE (report:Report {id: 99999999999999 + idRep, name: line.RepName, year: repYear, number: line.RepNumber})
CREATE (report)-[:hasauthor]->(aut)
CREATE (report)-[:in]->(org)
CREATE UNIQUE (org)-[:has]->(city);

LOAD CSV WITH HEADERS FROM "file:///TRefPublication.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.IDPubPlace) as idPlace, toInt(line.IDPublication) as idPub, toInt(line.PubYear) as pubYear
MATCH (aut:Author {id: 99999999999999 + idAut})
MATCH (city:City {id: idPlace})
CREATE (pub:Publication {id: 99999999999999 + idPub, name: line.PubName, year: pubYear})
CREATE (pub)-[:hasauthor]->(aut)
CREATE (pub)-[:in]->(city);

LOAD CSV WITH HEADERS FROM "file:///TReport.csv" AS line
WITH line, toInt(line.IDReport) as idRep, toInt(line.IDMonument) as idKnow, toInt(line.IDResearching) as idRes
MATCH (res:Research {id: 99999999999999 + idRes})
MATCH (k:Knowledge {id: 99999999999999 + idKnow})
MATCH (rep:Report {id: 99999999999999 + idRep})
MATCH (res)-[:has]->(k)
CREATE UNIQUE (res)-[:has]->(rep);


MATCH (t:Temp)
DELETE t;

MATCH (m:Monument)
MATCH (e:Epoch {id: 3})
CREATE (m)-[:has]->(e);


LOAD CSV WITH HEADERS FROM "file:///new_mon_coords.csv" AS line
WITH line, toInt(line.ID) as id
MERGE (mon:Monument {number: id})<-[:belongsto]-(k:Knowledge)
  ON MATCH SET k.x = line.N,
               k.y = line.E
  ON CREATE SET k.x = line.N,
                k.y = line.E,
                k.monument_name = line.Name;


LOAD CSV WITH HEADERS FROM "file:///old_mon.csv" AS line
WITH line, toInt(line.MonNumber) as idMon, toInt(line.IDMonType) as idMT
MERGE (m:Monument {number: idMon})<-[:belongsto]-(k:Knowledge)
  ON MATCH SET k.monument_name = k.monument_name +
  CASE idMT
    WHEN 1 THEN " городище"
    WHEN 2 THEN " селище"
    WHEN 3 THEN " местонахождение"
    WHEN 4 THEN " погребение"
    WHEN 5 THEN " могильник"
    ELSE ""
  END
;

create (status1:HeritageStatus {
  id: 1,
  name: 'Выявленный'
});
create (status2:HeritageStatus {
  id: 2,
  name: 'Находится на государственной охране'
});

create (sec1:SecurityType {
  id: 1,
  name: 'Федеральная'
});
create (sec2:SecurityType {
  id: 2,
  name: 'Региональная'
});

create (sw1:CardinalDirection {
  id: 1,
  name: 'Север'
});
create (sw2:CardinalDirection {
  id: 2,
  name: 'Северо-восток'
});
create (sw3:CardinalDirection {
  id: 3,
  name: 'Восток'
});
create (sw4:CardinalDirection {
  id: 4,
  name: 'Юго-восток'
});
create (sw5:CardinalDirection {
  id: 5,
  name: 'Юг'
});
create (sw6:CardinalDirection {
  id: 6,
  name: 'Юго-запад'
});
create (sw7:CardinalDirection {
  id: 7,
  name: 'Запад'
});
create (sw8:CardinalDirection {
  id: 8,
  name: 'Северо-запад'
});

create (ot1:OwnType {
  id: 1,
  name: 'Опция 1'
});
create (ot2:OwnType {
  id: 2,
  name: 'Опция 2'
});

create (dt1:DisposalType {
  id: 1,
  name: 'Опция 1'
});
create (dt2:DisposalType {
  id: 2,
  name: 'Опция 2'
});

create (fp1:FunctionalPurpose {
  id: 1,
  name: 'Опция 1'
});
create (fp2:FunctionalPurpose {
  id: 2,
  name: 'Опция 2'
});

create (avail1:Availability {
  id: 1,
  name: 'Опция 1'
});
create (avail2:Availability {
  id: 2,
  name: 'Опция 2'
});

create (ut1:UsageType {
  id: 1,
  name: 'Опция 1'
});
create (ut2:UsageType {
  id: 2,
  name: 'Опция 2'
});