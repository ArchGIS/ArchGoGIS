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
CREATE (k:Knowledge {id: idMon, monument_name: line.MonName, description: line.MonDescription, x: line.MonDecimalLatitude, y: line.MonDecimalLongitude})
CREATE (k)-[:belongsto]->(mon)
CREATE (mon)-[:has]->(mt)
CREATE (mon)-[:in]->(region);

LOAD CSV WITH HEADERS FROM "file:///TRefReport.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (city:City {id: line.IDPubPlace})
MATCH (org:Organisation {id: line.IDStorePlace})
CREATE (report:Report {id: line.IDReport, name: line.RepName, year: line.RepYear, number: line.RepNumber})
CREATE (report)-[:hasauthor]->(aut)
CREATE (report)-[:in]->(org)
CREATE UNIQUE (org)-[:has]->(city);

LOAD CSV WITH HEADERS FROM "file:///TRefPublication.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (city:City {id: line.IDPubPlace})
CREATE (pub:Publication {id: line.IDPublication, name: line.PubName, year: line.PubYear})
CREATE (pub)-[:hasauthor]->(aut)
CREATE (pub)-[:in]->(city);

LOAD CSV WITH HEADERS FROM "file:///TResearching.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (k:Knowledge {id: line.IDMonument})
CREATE (res:Research {id: line.IDResearching, year: line.ResYear})
CREATE (res)-[:hasauthor]->(aut)
CREATE (res)-[:has]->(k);

LOAD CSV WITH HEADERS FROM "file:///TReport.csv" AS line
WITH line
MATCH (res:Research {id: line.IDResearching})
MATCH (k:Knowledge {id: line.IDMonument})
MATCH (rep:Report {id: line.IDReport})
MATCH (res)-[:has]->(k)
CREATE UNIQUE (res)-[:has]->(rep);

MATCH (m:Monument)
MATCH (e:Epoch {id: "5"})
CREATE (m)-[:has]->(e);

create (rt1:ResearchType {id: 1, name: 'Аналитическое'});
create (rt2:ResearchType {id: 2, name: 'Раскопки'});
create (rt3:ResearchType {id: 3, name: 'Разведка'});
