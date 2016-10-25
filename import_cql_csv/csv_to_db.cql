LOAD CSV WITH HEADERS FROM "file:///TRefAutor.csv" AS line
WITH line, toInt(line.IDAutor) as id
CREATE (a:Author {id: id, name: line.AutorName});

LOAD CSV WITH HEADERS FROM "file:///TRefCulture.csv" AS line
WITH line, toInt(line.IDCulture) as idCulture
CREATE (c:Culture {id: idCulture, name: line.CultureName});

LOAD CSV WITH HEADERS FROM "file:///TRefCultureLayer.csv" AS line
WITH line, toInt(line.IDCultureLayer) as id
CREATE (e:Epoch {id: id, name: line.CultureLayer});

LOAD CSV WITH HEADERS FROM "file:///TRefMonType.csv" AS line
WITH line, toInt(line.IDMonType) as id
CREATE (mt:MonumentType {id: id, name: line.MonType});

LOAD CSV WITH HEADERS FROM "file:///TRefPubPlace.csv" AS line
WITH line, toInt(line.IDPubPlace) as id
CREATE (city:City {id: id, name: line.PubPlaceName});

LOAD CSV WITH HEADERS FROM "file:///TRefStorePlace.csv" AS line
WITH line, toInt(line.IDStorePlace) as id
CREATE (org:Organisation {id: id, name: line.StorePlaceName});

LOAD CSV WITH HEADERS FROM "file:///TRefState.csv" AS line
WITH line, toInt(line.IDState) as id
CREATE (st:State {id: id, name: line.StateName});

LOAD CSV WITH HEADERS FROM "file:///TRefRegion.csv" AS line
WITH line, toInt(line.IDRegion) as idReg, toInt(line.IDState) as idSt
MATCH (st:State {id: idSt})
CREATE (region:Region {id: idReg, name: line.RegionName})
CREATE (st)-[:has]->(region);

LOAD CSV WITH HEADERS FROM "file:///TMonument.csv" AS line
WITH line, toInt(line.IDRegion) as idReg, toInt(line.IDMonType) as idMT, toInt(line.IDState) as idSt, toInt(line.IDMonument) as idMon
MATCH (mt:MonumentType {id: idMT})
MATCH (state:State {id: idSt})
MATCH (region:Region {id: idReg})
CREATE (mon:Monument {id: idMon})
CREATE (k:Temp {id: idMon, monument_name: line.MonName, description: line.MonDescription, x: line.MonDecimalLatitude, y: line.MonDecimalLongitude})
CREATE (mon)-[:has]->(mt)
CREATE (mon)-[:in]->(region);

LOAD CSV WITH HEADERS FROM "file:///TRefReport.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.IDPubPlace) as idPlace, toInt(line.IDStorePlace) as idOrg, toInt(line.IDReport) as idRep, toInt(line.RepYear) as repYear
MATCH (aut:Author {id: idAut})
MATCH (city:City {id: idPlace})
MATCH (org:Organisation {id: idOrg})
CREATE (report:Report {id: idRep, name: line.RepName, year: repYear, number: line.RepNumber})
CREATE (report)-[:hasauthor]->(aut)
CREATE (report)-[:in]->(org)
CREATE UNIQUE (org)-[:has]->(city);

LOAD CSV WITH HEADERS FROM "file:///TRefPublication.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.IDPubPlace) as idPlace, toInt(line.IDPublication) as idPub, toInt(line.PubYear) as pubYear
MATCH (aut:Author {id: idAut})
MATCH (city:City {id: idPlace})
CREATE (pub:Publication {id: idPub, name: line.PubName, year: pubYear})
CREATE (pub)-[:hasauthor]->(aut)
CREATE (pub)-[:in]->(city);

LOAD CSV WITH HEADERS FROM "file:///TResearching.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.IDMonument) as idKnow, toInt(line.IDResearching) as idRes, toInt(line.ResYear) as resYear
MATCH (aut:Author {id: idAut})
MATCH (t:Temp {id: idKnow})
MATCH (m:Monument {id: t.id})
CREATE (res:Research {id: idRes, year: resYear, name: toString(t.monument_name + "-" + resYear)})
CREATE (k:Knowledge {id: t.id, monument_name: t.monument_name, description: t.description, x: t.x, y: t.y})
CREATE (res)-[:hasauthor]->(aut)
CREATE (res)-[:has]->(k)
CREATE (k)-[:belongsto]->(m);

LOAD CSV WITH HEADERS FROM "file:///TReport.csv" AS line
WITH line, toInt(line.IDReport) as idRep, toInt(line.IDMonument) as idKnow, toInt(line.IDResearching) as idRes
MATCH (res:Research {id: idRes})
MATCH (k:Knowledge {id: idKnow})
MATCH (rep:Report {id: idRep})
MATCH (res)-[:has]->(k)
CREATE UNIQUE (res)-[:has]->(rep);

MATCH (m:Monument)
MATCH (e:Epoch {id: 5})
CREATE (m)-[:has]->(e);

create (rt1:ResearchType {id: 1, name: 'Аналитическое'})
create (rt2:ResearchType {id: 2, name: 'Раскопки'})
create (rt3:ResearchType {id: 3, name: 'Разведка'});
