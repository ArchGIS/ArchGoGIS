LOAD CSV WITH HEADERS FROM "file:///pubs.csv" AS line
WITH line, toInt(line.IDAutor) as idAut, toInt(line.PageStart) as pStart, toInt(line.PageEnd) as pEnd, toInt(line.NumPages) as pages,
     toInt(line.EditionCont) as editCont, toInt(line.numOverall) as numOverall, toInt(line.Year) as year, toInt(line.id) as idCount
WHERE idAut <> 999

MERGE (p:Publication {name: line.PubName})
  ON CREATE SET p.id = 36 + idCount, p.published_at = year, p.editionContinue = editCont
  ON MATCH SET p.published_at = year, p.editionContinue = editCont
MERGE (a:Author {id: idAut})
MERGE (pt:PublicationType {name: line.PubType})
MERGE (et:EditionType {name: line.EditionType})
MERGE (city:City {name: line.City})

MERGE (p)-[:hasauthor]->(a)
MERGE (p)-[:has]->(pt)
MERGE (p)-[:has]->(et)
MERGE (p)-[:in]->(city)


FOREACH (ign IN CASE WHEN line.Publisher IS NOT NULL THEN [1] ELSE [] END |
  SET p.publisher = line.Publisher
)

FOREACH (ign IN CASE WHEN pStart IS NOT NULL THEN [1] ELSE [] END |
  SET p.pageFrom = pStart
)

FOREACH (ign IN CASE WHEN pEnd IS NOT NULL THEN [1] ELSE [] END |
  SET p.pageTo = pEnd
)

FOREACH (ign IN CASE WHEN pages IS NOT NULL THEN [1] ELSE [] END |
  SET p.pages = pages
)

FOREACH (ign IN CASE WHEN editCont IS NOT NULL THEN [1] ELSE [] END |
  SET p.pageFrom = pStart
)

FOREACH (ign IN CASE WHEN line.ISBN IS NOT NULL THEN [1] ELSE [] END |
  SET p.isbn = line.ISBN
)

FOREACH (ign IN CASE WHEN line.ISSN IS NOT NULL THEN [1] ELSE [] END |
  SET p.issn = line.ISSN
)

FOREACH (ign IN CASE WHEN line.Tom IS NOT NULL THEN [1] ELSE [] END |
  SET p.volume = line.Tom
)

FOREACH (ign IN CASE WHEN line.EdSeriesName IS NOT NULL THEN [1] ELSE [] END |
  SET p.editionSeriesName = line.EdSeriesName
)

FOREACH (ign IN CASE WHEN line.Edition IS NOT NULL THEN [1] ELSE [] END |
  SET p.edition = line.Edition
)

FOREACH (ign IN CASE WHEN line.numOverall IS NOT NULL THEN [1] ELSE [] END |
  SET p.numOverall = line.numOverall
)

FOREACH (ign IN CASE WHEN line.numYear IS NOT NULL THEN [1] ELSE [] END |
  SET p.numYear = line.numYear
)

FOREACH (ign IN CASE WHEN line.EditionName IS NOT NULL THEN [1] ELSE [] END |
  SET p.editionName = line.EditionName
)

FOREACH (ign IN CASE WHEN line.confName IS NOT NULL THEN [1] ELSE [] END |
  SET p.conferenceName = line.confName
)
;