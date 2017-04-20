create (:Culture {id: 231, name: "Буго-днестровская", en_name: "Bug-dnestr culture"})
create (:Culture {id: 232, name: "Каспийско-предкавказская культурная область", en_name: "Caspian-pre-caucasian cultural area"})
create (:Culture {id: 233, name: "Ракушечноярская", en_name: "Rakushechny yar culture"})
create (:Culture {id: 234, name: "Донецкая", en_name: "Donetskaya"})
create (:Culture {id: 235, name: "Каиршакская", en_name: "Kairshakskaya"})
create (:Culture {id: 236, name: "Орловская", en_name: "Orlovskaya"})
create (:Culture {id: 237, name: "тип струмель", en_name: "Strumel type"})
create (:Culture {id: 238, name: "Елшанская", en_name: "Elshanskaya"})
create (:Culture {id: 239, name: "Луговской тип", en_name: "Lugovskoy type"})
create (:Culture {id: 240, name: "Верхневолжская", en_name: "Upper Volga culture"})
create (:Culture {id: 241, name: "Культура линейно-ленточной керамики", en_name: "Linear-band pottery"})
create (:Culture {id: 242, name: "Яниславицкая культура", en_name: "Yanislavitskaya culture"})
create (:Culture {id: 243, name: "Киево-черкасская культура", en_name: "Kiev-cherkasskaya culture"})
create (:Culture {id: 244, name: "Верхнеднепровская культура", en_name: "Upper Dnepr culture"})
create (:Culture {id: 245, name: "Матвеевокурганская", en_name: "Matveev kurgan culture"})
create (:Culture {id: 246, name: "Песочноровская", en_name: "Pesochnorovkskaya culture"})
create (:Culture {id: 247, name: "Азово-днепровская", en_name: "Azov-dnepr culture"})
create (:Culture {id: 248, name: "Карамышевская", en_name: "Karamyshevskaya culture"})
create (:Culture {id: 249, name: "Джангарская", en_name: "Dzhangarskaya culture"})
create (:Culture {id: 250, name: "Тентексорская", en_name: "Tenteksorskaya"})
create (:Culture {id: 251, name: "Среднедонская", en_name: "Middle Don (Srednedonskaya) culture"})
create (:Culture {id: 252, name: "Криш", en_name: "Krish"})
create (:Culture {id: 253, name: "Днепро-донецкая", en_name: "Dnepr-donetsk culture"})


create (r:Research {id: 1, name: "Социально-экономическое развитие население Среднего Поволжья в середине I тыс. н.э.", year: 2011})
with r
match (a:Author {name: "Вязов Л.А."})
create (r)-[:hasauthor]->(a)

match (r:Research {id: 1}) with r match (m:Monument) where m.number is not null with m match (m)--(k:Knowledge) where k.id > 10000000000 with m, k return m.number, k.id;


LOAD CSV WITH HEADERS FROM "file:///imenk.csv" AS line
WITH line, toInt(line.Number) as num, [] as list
MATCH (r:Research {id: 165})
MATCH (c:Culture {id: 100000000000002})
OPTIONAL MATCH (m:Monument {number: num})
FOREACH(ign IN CASE WHEN m.number IS NOT NULL THEN [1] ELSE [] END |
  CREATE (k:Knowledge {id: 12011 + num, monument_name: line.Name, description: line.Description})
  CREATE (r)-[:has]->(k)
  CREATE (k)-[:belongsto]->(m)
  CREATE (k)-[:has]->(c)
)
FOREACH(ign IN CASE WHEN m.number IS NULL THEN [1] ELSE [] END |
  CREATE (:Bounty {num: num})
);