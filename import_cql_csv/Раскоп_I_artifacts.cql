LOAD CSV WITH HEADERS FROM "file:///Sviazhsk_artefakty.csv" AS line
WITH line, toInt(line.Count) as count
MATCH (exc:Excavation {id: 4})

CREATE (art:Artifact {
	id: 99999999999999 + count,
	name: line.`Наименование`,
	x: line.N,
	y: line.E,
	excRegion: line.`Участок (квадрат)`,
	depth: coalesce(line.`Глубина`, "")
})
MERGE (exc)-[:has]->(art)

FOREACH(ign IN CASE WHEN line.`Фотография` IS NOT NULL THEN [1] ELSE [] END |
  CREATE (img:Image {fileid: line.`Фотография`})
  MERGE (art)-[:has]->(img)
)
;