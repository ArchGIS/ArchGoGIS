LOAD CSV WITH HEADERS FROM "file:///TRefAutor.csv" AS line
WITH line
CREATE (a:Author {id: line.IDAutor, name: line.AutorName})
RETURN a;

LOAD CSV WITH HEADERS FROM "file:///TRefCulture.csv" AS line
WITH line
CREATE (c:Culture {id: line.IDCulture, name: line.CultureName})
RETURN c;

LOAD CSV WITH HEADERS FROM "file:///TRefCultureLayer.csv" AS line
WITH line
CREATE (e:Epoch {id: line.IDCultureLayer, name: line.CultureLayer})
RETURN e;

LOAD CSV WITH HEADERS FROM "file:///TRefMonType.csv" AS line
WITH line
CREATE (mt:MonumentType {id: line.IDMonType, name: line.MonType})
RETURN mt;

LOAD CSV WITH HEADERS FROM "file:///TRefPubPlace.csv" AS line
WITH line
CREATE (city:City {id: line.IDPubPlace, name: line.PubPlaceName})
RETURN city;

LOAD CSV WITH HEADERS FROM "file:///TRefStorePlace.csv" AS line
WITH line
CREATE (stor:Storage {id: line.IDStorePlace, name: line.StorePlaceName})
RETURN stor;

LOAD CSV WITH HEADERS FROM "file:///TRefState.csv" AS line
WITH line
CREATE (st:State {id: line.IDState, name: line.StateName})
RETURN st;

LOAD CSV WITH HEADERS FROM "file:///TRefRegion.csv" AS line
WITH line
MATCH (st:State {id: line.IDState})
CREATE (region:Region {id: line.IDRegion, name: line.RegionName})
CREATE (st)-[:has]->(region)
RETURN st, region;

LOAD CSV WITH HEADERS FROM "file:///TMonument.csv" AS line
WITH line
MATCH (mt:MonumentType {id: line.IDMonType})
MATCH (state:State {id: line.IDState})
MATCH (region:Region {id: line.IDRegion})
CREATE (mon:Monument {id: line.IDMonument})
CREATE (k:Knowledge {id: line.IDMonument, monument_name: line.MonName, description: line.MonDescription, x: line.MonDecimalLatitude, y: line.MonDecimalLongitude})
CREATE (k)-[:belongsto]->(mon)
CREATE (mon)-[:has]->(mt)
CREATE (mon)-[:in]->(region);

LOAD CSV WITH HEADERS FROM "file:///TRefReport.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (city:City {id: line.IDPubPlace})
MATCH (stor:Storage {id: line.IDStorePlace})
CREATE (report:Report {id: line.IDReport, name: line.RepName, year: line.RepYear, number: line.RepNumber})
CREATE (report)-[:hasauthor]->(aut)
CREATE (report)-[:in]->(stor)
CREATE (stor)-[:has]->(city); // исправить множественные связи!

LOAD CSV WITH HEADERS FROM "file:///TRefPublication.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (city:City {id: line.IDPubPlace})
CREATE (pub:Publication {id: line.IDPublication, name: line.PubName, year: line.PubYear})
CREATE (pub)-[:hasauthor]->(aut)
CREATE (pub)-[:in]->(city);

LOAD CSV WITH HEADERS FROM "file:///TRefArchiveSource.csv" AS line
WITH line
MATCH (aut:Author {id: line.IDAutor})
MATCH (st:Storage {id: line.IDStorePlace})
CREATE (pub:Publication {id: line.IDArchiveSource, name: line.ArchiveSourceName, year: line.SourceYear})
CREATE (pub)-[:hasauthor]->(aut)
CREATE (pub)-[:in]->(st);

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
CREATE (res)-[:has]->(rep);